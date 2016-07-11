
//
// Comment VSCODE - Having a basic support for KFCS inside Visual Studio Code
// Copyright 2016 Kary Foundation, Inc. All rights reserved.a
//    Author: Pouya Kary <k@karyfoundation.org>
//

//
// ─── SETTINGS ───────────────────────────────────────────────────────────────────
//

    "use strict";

//
// ─── IMPORTS ────────────────────────────────────────────────────────────────────
//

    var vscode = require( 'vscode' );

//
// ─── CONSTANTS ──────────────────────────────────────────────────────────────────
//

    const commentLineCharacter = '\u2500';

//
// ─── DEFS ───────────────────────────────────────────────────────────────────────
//

    // Environmental information
    var oneLineCommentSign;
    var currentLine;
    var currentLineString;
    var currentLanguageId;
    var currentInsertSpacesStatus;
    var currentTabSize;
    var lineFormat;

    // Information for processing...
    var linesFirstSpacing;
    var realIndentationSize;
    var relativeIndentationSize;

//
// ─── GET ENVIRONMENTAL INFORMATION ──────────────────────────────────────────────
//

    function loadEnvironmentalInformation (  ) {
        // loading information
        currentLine                 = vscode.window.activeTextEditor.selection.active.line;
        currentLineString           = vscode.window.activeTextEditor.document.lineAt( currentLine ).text;
        currentLanguageId           = vscode.window.activeTextEditor.document.languageId;
        currentInsertSpacesStatus   = vscode.window.activeTextEditor.options.insertSpaces;
        currentTabSize              = vscode.window.activeTextEditor.options.tabSize;
    }

//
// ─── GENERATE REGEX FOR LANGUAGE ────────────────────────────────────────────────
//

    function generateRegExForCurrentLanguage (  ) {
        return new RegExp( `^\s*(${ oneLineCommentSign })?([a-zA-Z ]|[0-9][0-9\.]*)+\s*$` );
    }

//
// ─── GET ONE LINE COMMENT SIGN FOR CURRENT LANGUAGE ─────────────────────────────
//

    function getOneLineLanguageCommentSignForCurrentLanguage ( ) {
        switch ( currentLanguageId ) {
            case 'arendelle':
            case 'pageman':
            case 'javascript':
            case 'typescript':
            case 'swift':
            case 'csharp':
            case 'cpp':
            case 'processing':
            case 'java':
            case 'json':
            case 'rust':
            case 'go':
            case 'scala':
            case 'qml':
            case 'stylus':
                return '//';

            case 'ruby':
            case 'python':
            case 'julia':
            case 'make':
            case 'makefile':
            case 'shell':
            case 'bash':
            case 'coffeescript':
            case 'powershell':
                return '#';

            case 'tex':
            case 'latex':
            case 'matlab':
            case 'octave':
                return '%';
            
            case 'lua':
            case 'haskell':
            case 'elm':
                return '--';

            case 'scheme':
            case 'racket':
            case 'lisp':
                return ';;;';

            default :
                return null;
        }
    }

//
// ─── PROCESS CURRENT LINE ───────────────────────────────────────────────────────
//

    function processCurrentLine ( ) {
        linesFirstSpacing       = getFirstSpacingOfTheLine( );
        realIndentationSize     = getRealIndentationSize( linesFirstSpacing );
        relativeIndentationSize = getKFCSRelativeIndentation( realIndentationSize );
    }

//
// ─── GET SPACING FOR THE FIRST OF THE LINE ──────────────────────────────────────
//

    function getFirstSpacingOfTheLine ( ) {
        let tabs = 0;
        let spaces = 0;
        let index = 0;

        while ( index < currentLineString.length ) {
            switch ( currentLineString[ index ] ) {
                case '\t':
                    tabs++;
                    index++;
                    break;

                case ' ':
                    spaces++;
                    index++;
                    break;

                default:
                    return { 'tabs': tabs, 'spaces': spaces }
            }
        }
    }

//
// ─── GET INDENTATION SIZE ───────────────────────────────────────────────────────
//

    function getRealIndentationSize ( ) {
        return linesFirstSpacing.tabs + Math.floor( linesFirstSpacing.spaces / currentTabSize );
    }

//
// ─── GET RELATIVE INDENTATION SIZE ──────────────────────────────────────────────
//

    function getKFCSRelativeIndentation ( realIndentation ) {
        return Math.floor( realIndentation / 2 );
    }

//
// ─── GENERATE COMMENT ───────────────────────────────────────────────────────────
//

    function generateSectionComment ( width ) {
        let text = currentLineString.toUpperCase( ).trim( );
        let indentationText = generateIndentation( );

        // line 1
        let result = `${ indentationText }${ oneLineCommentSign }\n`;

        // line 2
        result += `${ indentationText }${ oneLineCommentSign } ${ repeat( commentLineCharacter , 3 )} ${ text } ${ repeat( commentLineCharacter, width - text.length - 5 ) }\n`;

        // line 3
        result += `${ indentationText }${ oneLineCommentSign }\n`

        // done
        return result;
    }

//
// ─── GENERATE INSECTION COMMENTS ────────────────────────────────────────────────
//

    function generateInSectionComments ( ) {
        let text = currentLineString.toUpperCase( ).trim( );
        let indentationText = generateIndentation( );

        // line 1
        let result = `${ indentationText }${ oneLineCommentSign }\n`;

        // line 2
        result += `${ indentationText }${ oneLineCommentSign } ${ text }\n`;

        // line 3
        result += `${ indentationText }${ oneLineCommentSign }\n`

        // done
        return result;
    }

//
// ─── INDENT BASED ON THE INDENTATION INFO ───────────────────────────────────────
//

    function generateIndentation ( ) {
        let result = '';
        let size = linesFirstSpacing.tabs * currentTabSize + linesFirstSpacing.spaces;
        return repeat( ' ' , size );
    }

//
// ─── REPEAT TEXT ────────────────────────────────────────────────────────────────
//

    function repeat ( text, times ) {
        let result = '';
        for ( let index = 0; index < times; index ++ ) {
            result += text;
        }
        return result;
    }

//
// ─── GENERATE COMMENT BASED ON INDENTATION ──────────────────────────────────────
//

    function generateCommentBasedOnIndentation ( ) {
        switch ( relativeIndentationSize ) {
            case 0:
                return generateSectionComment( 80 );
            case 1:
                return generateSectionComment( 65 );
            default:
                return generateInSectionComments( );
        }
    }

//
// ─── REPLACE COMMENT ON TEXT EDITOR ─────────────────────────────────────────────
//

    function replaceCommentOnEditor ( comment ) {
        vscode.window.activeTextEditor.edit( textEditorEdit => {
            textEditorEdit.replace(
                vscode.window.activeTextEditor.document.lineAt( currentLine ).range,
                comment
            );
        });
    }

//
// ─── CANCEL SELECTION ───────────────────────────────────────────────────────────
//

    function removeSelection ( ) {
        
    }

//
// ─── BODY ───────────────────────────────────────────────────────────────────────
//

    function activate ( context ) {
        var disposable = vscode.commands.registerCommand(
            'comment5.makeLineSectionComment', ( ) => {

                try {
                    // basic information:
                    loadEnvironmentalInformation( );

                    // language specific parts:
                    oneLineCommentSign  = getOneLineLanguageCommentSignForCurrentLanguage( );
                    if ( oneLineCommentSign === null ) {
                        vscode.window.showInformationMessage(`Comment 5 Error: Language "${ currentLanguageId }" is not supported by Comment 5.`);
                        return;
                    }
                    lineFormat = generateRegExForCurrentLanguage( );

                    // checking the input against the regex
                    if ( !lineFormat.test( currentLineString ) ) {
                        vscode.window.showInformationMessage( 'Comment 5 Error: Comment text must only contain basic alphabet and numbers.' );
                        return;
                    }

                    // generate comment
                    processCurrentLine( );
                    let comment = generateCommentBasedOnIndentation( );

                    // apply to editor
                    replaceCommentOnEditor( comment );

                    // done!
                    vscode.commands.executeCommand('cancelSelection');

                } catch ( err ) {
                    vscode.window.showInformationMessage( err.message );
                }

            });

        context.subscriptions.push( disposable );
    }

    exports.activate = activate;

//
// ─── DEACTIVATE ─────────────────────────────────────────────────────────────────
//

    function deactivate ( ) {
        // And there was a place, nothing ever happened at....
    }

    exports.deactivate = deactivate;

// ────────────────────────────────────────────────────────────────────────────────