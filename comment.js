
//
// Comment VSCODE - Having a basic support for KFCS inside Visual Studio Code
// Copyright 2016 Kary Foundation, Inc. All rights reserved.a
//    Author: Pouya Kary <k@karyfoundation.org>
//

//
// ──────────────────────────────────────────────── I ──────────
//  :::::: B A S E : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────
//

//
// ─── SETTINGS ───────────────────────────────────────────────────────────────────
//

    "use strict";

//
// ─── IMPORTS ────────────────────────────────────────────────────────────────────
//

    var vscode = require( 'vscode' );
    var roman  = require( './roman.js' );

//
// ─── CONSTANTS ──────────────────────────────────────────────────────────────────
//

    const commentLineCharacter = '\u2500';
    const lineFormat = /^\s*([a-z ]|[0-9][0-9\.]*)+\s*$/i;

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

    // Information for processing...
    var linesFirstSpacing;
    var realIndentationSize;
    var relativeIndentationSize;

//
// ─── BODY ───────────────────────────────────────────────────────────────────────
//

    function activate ( context ) {
        // Generate flag comment
        context.subscriptions.push( vscode.commands.registerCommand(
            'comment.makeFlagComment', onGenerateFlagComment
        ));

        // Generate comment command
        context.subscriptions.push( vscode.commands.registerCommand(
            'comment.makeSectionComment', onGenerateSectionComment
        ));

        // Generate line command
        context.subscriptions.push( vscode.commands.registerCommand (
            'comment.makeLineComment', onGenerateLineComment
        ));
    }

    exports.activate = activate;

//
// ─── DEACTIVATE ─────────────────────────────────────────────────────────────────
//

    function deactivate ( ) {
        // And there was a place, nothing ever happened at....
    }

    exports.deactivate = deactivate;

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
// ─── GET ONE LINE COMMENT SIGN FOR CURRENT LANGUAGE ─────────────────────────────
//

    function getOneLineLanguageCommentSignForCurrentLanguage ( ) {
        switch ( currentLanguageId ) {
            case 'arendelle':
            case 'pageman':
            case 'javascript':
            case 'javascriptreact':
            case 'typescript':
            case 'typescriptreact':
            case 'swift':
            case 'csharp':
            case 'cpp':
            case 'objective-c':
            case 'processing':
            case 'java':
            case 'json':
            case 'rust':
            case 'go':
            case 'scala':
            case 'qml':
            case 'stylus':
            case 'groovy':
            case 'less':
            case 'php':
                return '//';

            case 'ruby':
            case 'python':
            case 'julia':
            case 'make':
            case 'makefile':
            case 'shell':
            case 'bash':
            case 'shellscript':
            case 'coffeescript':
            case 'powershell':
            case 'perl':
            case 'r':
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
            case 'clojure':
                return ';;;';

            case 'bat':
                return '::';

            case 'vb':
                return "'";

            case 'plaintext':
                return commentLineCharacter + commentLineCharacter;

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
                    return { 'tabs': tabs, 'spaces': spaces };
            }
        }
        return { 'tabs': tabs, 'spaces': spaces };
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
// ─── INDENT BASED ON THE INDENTATION INFO ───────────────────────────────────────
//

    function generateIndentation ( ) {
        return repeat( ' ' , linesFirstSpacing.spaces ) + computeTabs( linesFirstSpacing.tabs );
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
// ─── GET TAB ────────────────────────────────────────────────────────────────────
//

    function computeTabs ( tabs ) {
        if ( currentInsertSpacesStatus ) {
            return repeat( ' ' , currentTabSize * tabs );
        } else {
            return repeat( '\t' , tabs );
        }
    }

//
// ─── REMOVE STARTING PARTS OF THE COMMENT ───────────────────────────────────────
//

    function removeStartingCommentParts ( ) {
        let comment = currentLineString.trim( );
        if ( comment.startsWith( oneLineCommentSign ) ) {
            vscode.window.showInformationMessage(
                comment.substring( oneLineCommentSign.length )
            );
        }
    }

//
// ─── REPLACE COMMENT ON TEXT EDITOR ─────────────────────────────────────────────
//

    function replaceCommentOnEditor ( comment , spacings ) {
        vscode.window.activeTextEditor.edit( textEditorEdit => {
            textEditorEdit.replace(
                vscode.window.activeTextEditor.document.lineAt( currentLine ).range,
                comment
            );
        });
    }

//
// ─── GENERATE ADDITIONAL SPACINGS ───────────────────────────────────────────────
//

    function generateAdditionalSpacingsForComments ( ) {
        let spacings = `\n${ generateIndentation( ) }`;
        if ( relativeIndentationSize < 2 ) {
            spacings += computeTabs( 1 );
        }
        return spacings;
    }

//
// ─── COMMENT GENERATION BODY ────────────────────────────────────────────────────
//

    function generateCommentWithFormula ( func ) {
        try {
            // basic information:
            loadEnvironmentalInformation( );

            // language specific parts:
            oneLineCommentSign  = getOneLineLanguageCommentSignForCurrentLanguage( );
            if ( oneLineCommentSign === null ) {
                vscode.window.showInformationMessage(
                    `Comment Error: Language "${ currentLanguageId }" is not supported by Comment 5.`
                );
                return;
            }

            // generate comment
            processCurrentLine( );

            // generate the comment
            let comment = func( );
            if ( comment === null ) return;

            // apply to editor
            replaceCommentOnEditor( comment );

            // done!
            vscode.commands.executeCommand( 'cancelSelection' );

        } catch ( err ) {
            vscode.window.showInformationMessage(
                `Comment 5 Error: ${ err.message } at ${ err.lineNumber }`
            );
        }
    }

// ────────────────────────────────────────────────────────────────────────────────





//
// ────────────────────────────────────────────────────────────────────────── II ──────────
//  :::::: S E L E C T I O N   C O M M E N T : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────
//

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
// ─── ON GENERATE COMMENT ────────────────────────────────────────────────────────
//

    function onGenerateSectionComment ( ) {
        generateCommentWithFormula( ( ) => {
            // checking the input against the regex
            if ( !lineFormat.test( currentLineString ) ) {
                vscode.window.showInformationMessage(
                    'Comment Error: Comment text must only contain basic alphabet and numbers.'
                );
                return null;
            }

            // return comment...
            return generateCommentBasedOnIndentation( );
        });
    }

//
// ─── GENERATE COMMENT BASED ON INDENTATION ──────────────────────────────────────
//

    function generateCommentBasedOnIndentation ( ) {

        let comment;

        switch ( relativeIndentationSize ) {
            case 0:
                comment = generateSectionComment( 80 );
                break;
            case 1:
                comment = generateSectionComment( 65 );
                break;
            default:
                comment = generateInSectionComments( );
                break;
        }

        return comment + generateAdditionalSpacingsForComments( );
    }

// ────────────────────────────────────────────────────────────────────────────────





//
// ──────────────────────────────────────────────────────────────── III ──────────
//  :::::: L I N E   C O M M E N T : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────
//

//
// ─── GENERATE ADDITIONAL SPACING FOR LINES ──────────────────────────────────────
//

    function generateAdditionalSpacingsForLines ( ) {
        return `\n${ generateIndentation( ) }`;
    }

//
// ─── GENERATE LINE COMMENT ──────────────────────────────────────────────────────
//

    function generateLineComment ( width ) {
        return `${ generateIndentation( ) }${ oneLineCommentSign } ${ repeat( commentLineCharacter, width ) }\n`;;
    }

//
// ─── GENERATE SEPARATOR COMMENTS ────────────────────────────────────────────────
//

    function generateSeparatorComments ( ) {
        return `${ generateIndentation( ) }${ oneLineCommentSign } • • • • •`;
    }

//
// ─── ON GENERATE LINE ───────────────────────────────────────────────────────────
//

    function onGenerateLineComment ( ) {
        generateCommentWithFormula( ( ) => {
            let line;
            switch ( relativeIndentationSize ) {
                case 0:
                    line = generateLineComment( 80 );
                    break;
                case 1:
                    line = generateLineComment( 65 );
                    break;
                default:
                    line = generateSeparatorComments( );
                    break;
            }
            return line + generateAdditionalSpacingsForLines( );
        });
    }

// ────────────────────────────────────────────────────────────────────────────────





//
// ──────────────────────────────────────────────────────────────── IV ──────────
//  :::::: F L A G   C O M M E N T : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────
//

//
// ─── ON GENERATE FLAG ───────────────────────────────────────────────────────────
//

    function onGenerateFlagComment ( ) {
        generateCommentWithFormula( ( ) => {
            // checking the input against the regex
            if ( !lineFormat.test( currentLineString ) ) {
                vscode.window.showInformationMessage(
                    'Comment Error: Comment text must only contain basic alphabet and numbers.'
                );
                return null;
            }

            return generateFlagCommentString( );
        });
    }

//
// ─── GENERATE FLAG COMMENT ──────────────────────────────────────────────────────
//

    function generateFlagCommentString ( ) {
        let text = makeFlagCommentText( currentLineString.toUpperCase( ).trim( ) );
        let indentationText = generateIndentation( );

        // line 1
        let comment = `${ indentationText }${ oneLineCommentSign }\n`;

        // line 2
        comment += `${ indentationText }${ oneLineCommentSign } ${ repeat( commentLineCharacter , text.length + 40 )} XX ${ repeat( commentLineCharacter , 10 )}\n`;

        // line 3
        comment += `${ indentationText }${ oneLineCommentSign }   :::::: ${ text }: :  :   :    :     :        :          :\n`;

        // line 4
        comment += `${ indentationText }${ oneLineCommentSign } ${ repeat( commentLineCharacter , 50 + text.length ) } \n`;

        // line 5
        comment += `${ indentationText }${ oneLineCommentSign }`;

        // done
        return comment;
    }

//
// ─── MAKE TITLE TEXT ────────────────────────────────────────────────────────────
//

    function makeFlagCommentText ( text ) {
        let title = '';
        for ( let index = 0; index < text.length; index++ ) {
            title += `${ text[ index ]} `;
        }
        return title;
    }

// ────────────────────────────────────────────────────────────────────────────────