//
// Comment VSCODE - Having a basic support for KFCS inside Visual Studio Code
// Copyright 2016 Kary Foundation, Inc. All rights reserved.a
//    Author: Pouya Kary <k@karyfoundation.org>
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

        // information that also needs computation (order is important in here...)
        oneLineCommentSign          = getOneLineLanguageCommentSignForCurrentLanguage( );
        lineFormat                  = generateRegExForCurrentLanguage( );
    }

//
// ─── GENERATE REGEX FOR LANGUAGE ────────────────────────────────────────────────
//

    function generateRegExForCurrentLanguage (  ) {
        return new RegExp( `\s*(${ oneLineCommentSign })?([a-zA-Z ]|[0-9][0-9\.]*)+\s*` );
    }

//
// ─── GET ONE LINE COMMENT SIGN FOR CURRENT LANGUAGE ─────────────────────────────
//

    function getOneLineLanguageCommentSignForCurrentLanguage ( ) {
        switch ( currentLanguageId ) {
            default :
                return '//';
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
                    return {
                        'tabs': tabs,
                        'spaces': spaces
                    }
            }
        }

        return {
            'tabs': tabs, 'spaces': spaces
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

    function activate( context ) {
        var disposable = vscode.commands.registerCommand(
            'commentVSCode.makeLineSectionComment', ( ) => {

                try {
                    // basic information:
                    loadEnvironmentalInformation( );
                    processCurrentLine( );

                    // generate comment
                    let comment = generateCommentBasedOnIndentation( );

                    // apply to editor
                    replaceCommentOnEditor( comment );
                    removeSelection( );

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