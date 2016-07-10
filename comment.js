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
// ─── DEFS ───────────────────────────────────────────────────────────────────────
//

    var oneLineCommentSign;
    var currentLine;
    var currentLineString;
    var currentLanguageId;
    var currentInsertSpacesStatus;
    var currentTabSize;
    var lineFormat;

//
// ─── GET ENVIRONMENTAL INFORMATION ──────────────────────────────────────────────
//

    function loadEnvironmentalInformation (  ) {
        currentLine                 = vscode.window.activeTextEditor.selection.start.line;
        currentLineString           = vscode.window.activeTextEditor.document.lineAt( currentLine );
        currentLanguageId           = vscode.window.activeTextEditor.document.languageId;
        currentInsertSpacesStatus   = vscode.window.activeTextEditor.options.insertSpaces;
        currentTabSize              = vscode.window.activeTextEditor.options.tabSize;
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
// ─── BODY ───────────────────────────────────────────────────────────────────────
//

    function activate( context ) {
        var disposable = vscode.commands.registerCommand(
            'commentVSCode.makeLineSectionComment', ( ) => {
                loadEnvironmentalInformation( );

            });

        context.subscriptions.push(disposable);
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