
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

    "use strict"

//
// ─── IMPORTS ────────────────────────────────────────────────────────────────────
//

    const vscode = require( 'vscode' )
    const roman  = require( './roman.js' )

//
// ─── CONSTANTS ──────────────────────────────────────────────────────────────────
//

    const commentLineCharacter =
        '\u2500'
    const lineFormat =
        /^\s*([a-z ]|[0-9][0-9\.]*|[\:\-\+\@\!\?])+\s*$/i
    const lineFormatErrorMessage =
        "'Comment Error: Comment text must only contain basic alphabet, numbers, :, -, +, @, ?, and !"

//
// ─── DEFS ───────────────────────────────────────────────────────────────────────
//

    // Environmental information
    var languageCommentSignSettings
    var currentLine
    var currentLineString
    var currentLanguageId
    var currentInsertSpacesStatus
    var currentTabSize

    // Information for processing...
    var linesFirstSpacing
    var realIndentationSize
    var relativeIndentationSize

//
// ─── BODY ───────────────────────────────────────────────────────────────────────
//

    function activate ( context ) {
        // Generate flag comment
        context.subscriptions.push( vscode.commands.registerCommand(
            'comment.makeFlagComment', onGenerateFlagComment
        ))

        // Generate comment command
        context.subscriptions.push( vscode.commands.registerCommand(
            'comment.makeSectionComment', ( ) => onGenerateSectionComment( 'normal' )
        ))

        context.subscriptions.push( vscode.commands.registerCommand(
            'comment.makeReverseSectionComment', ( ) => onGenerateSectionComment( 'reverse' )
        ))

        // Generate line command
        context.subscriptions.push( vscode.commands.registerCommand (
            'comment.makeLineComment', onGenerateLineComment
        ))
    }

    exports.activate = activate

//
// ─── DEACTIVATE ─────────────────────────────────────────────────────────────────
//

    function deactivate ( ) {
        // And there was a place, nothing ever happened at....
    }

    exports.deactivate = deactivate

//
// ─── GET ENVIRONMENTAL INFORMATION ──────────────────────────────────────────────
//

    function loadEnvironmentalInformation (  ) {
        // loading information
        currentLine =
            vscode.window.activeTextEditor.selection.active.line
        currentLineString =
            vscode.window.activeTextEditor.document.lineAt( currentLine ).text
        currentLanguageId =
            vscode.window.activeTextEditor.document.languageId
        currentInsertSpacesStatus =
            vscode.window.activeTextEditor.options.insertSpaces
        currentTabSize =
            vscode.window.activeTextEditor.options.tabSize
    }

//
// ─── GET ONE LINE COMMENT SIGN FOR CURRENT LANGUAGE ─────────────────────────────
//

    function getOneLineLanguageCommentSignForCurrentLanguage ( ) {
        // In case of comments like:
        //  --
        //  -- ─── TEXT ────────────────────────────────────
        //  --
        const currentToEOL =
            getLineCommentCharacterForCurrentToEOLLanguages( )
        if ( currentToEOL !== null )
            return { start: currentToEOL, middle: currentToEOL, end: currentToEOL }

        // In case of comments like:
        //  /*
        //   * ─── TEXT ────────────────────────────────────
        //   */
        const multiLineComment =
            getMultiLineCommentCharacters( )

        return multiLineComment
    }

//
// ─── GET MULTI LINE COMMENT CHARACTERS ──────────────────────────────────────────
//

    function getMultiLineCommentCharacters ( ) {
        switch ( currentLanguageId ) {
            case "css":
            case "c":
                return { start: "/*", middle: " *", end: " */" }

            case "html":
            case "xml":
            case "xhtml":
            case "us":
            case "xaml":
            case "plist":
                return { start: "<!--", middle: "  --", end: "  -->" }

            default:
                return null
        }
    }

//
// ─── GET ONE LINE COMMENT CHARACTERS ────────────────────────────────────────────
//

    function getLineCommentCharacterForCurrentToEOLLanguages ( ) {
        switch ( currentLanguageId ) {
            case 'arendelle':
            case 'cpp':
            case 'csharp':
            case 'fsharp':
            case 'go':
            case 'groovy':
            case 'haxe':
            case 'java':
            case 'javascript':
            case 'javascriptreact':
            case 'jison':
            case 'json':
            case 'karyscript':
            case 'less':
            case 'objective-c':
            case 'pageman':
            case 'pegjs':
            case 'php':
            case 'processing':
            case 'qml':
            case 'rust':
            case 'scala':
            case 'stylus':
            case 'swift':
            case 'typescript':
            case 'typescriptreact':
            case 'uno':
            case 'yuml':
            case 'glsl':
                return '//'

            case 'bash':
            case 'coffeescript':
            case 'fish':
            case 'julia':
            case 'make':
            case 'makefile':
            case 'nearley':
            case 'perl':
            case 'powershell':
            case 'python':
            case 'r':
            case 'ruby':
            case 'shell':
            case 'shellscript':
            case 'yaml':
            case 'yml':
                return '#'

            case 'latex':
            case 'matlab':
            case 'octave':
            case 'tex':
                return '%'

            case 'elm':
            case 'haskell':
            case 'purescript':
            case 'lua':
            case 'sql':
                return '--'

            case 'clojure':
            case 'lisp':
            case 'racket':
            case 'scheme':
                return ''

            case 'bat':
                return '::'

            case 'vb':
                return "'"

            case 'plaintext':
                return commentLineCharacter + commentLineCharacter

            default:
                return null
        }
    }

//
// ─── PROCESS CURRENT LINE ───────────────────────────────────────────────────────
//

    function processCurrentLine ( ) {
        linesFirstSpacing =
            getFirstSpacingOfTheLine( )
        realIndentationSize =
            getRealIndentationSize( linesFirstSpacing )
        relativeIndentationSize =
            getKFCSRelativeIndentation( realIndentationSize )
    }

//
// ─── GET SPACING FOR THE FIRST OF THE LINE ──────────────────────────────────────
//

    function getFirstSpacingOfTheLine ( ) {
        let tabs = 0
        let spaces = 0
        let index = 0

        while ( index < currentLineString.length ) {
            switch ( currentLineString[ index ] ) {
                case '\t':
                    tabs++
                    index++
                    break

                case ' ':
                    spaces++
                    index++
                    break

                default:
                    return { tabs, spaces }
            }
        }
        return { tabs, spaces }
    }

//
// ─── GET INDENTATION SIZE ───────────────────────────────────────────────────────
//

    function getRealIndentationSize ( ) {
        return linesFirstSpacing.tabs + Math.floor( linesFirstSpacing.spaces / currentTabSize )
    }

//
// ─── GET RELATIVE INDENTATION SIZE ──────────────────────────────────────────────
//

    function getKFCSRelativeIndentation ( realIndentation ) {
        return Math.floor( realIndentation / 2 )
    }

//
// ─── INDENT BASED ON THE INDENTATION INFO ───────────────────────────────────────
//

    function generateIndentation ( ) {
        return repeat( ' ' , linesFirstSpacing.spaces ) + computeTabs( linesFirstSpacing.tabs )
    }

//
// ─── REPEAT TEXT ────────────────────────────────────────────────────────────────
//

    function repeat ( text, times ) {
        let result = ''
        for ( let index = 0; index < times; index ++ )
            result += text
        return result
    }

//
// ─── GET TAB ────────────────────────────────────────────────────────────────────
//

    function computeTabs ( tabs ) {
        if ( currentInsertSpacesStatus )
            return repeat( ' ' , currentTabSize * tabs )
        else
            return repeat( '\t' , tabs )
    }

//
// ─── REMOVE STARTING PARTS OF THE COMMENT ───────────────────────────────────────
//

    function removeStartingCommentParts ( ) {
        const comment =
            currentLineString.trim( )
        if ( comment.startsWith( languageCommentSignSettings ) )
            vscode.window.showInformationMessage(
                comment.substring( languageCommentSignSettings.length ) )
    }

//
// ─── REPLACE LINE ───────────────────────────────────────────────────────────────
//

    function replaceLine ( line , text ) {
        vscode.window.activeTextEditor.edit( textEditorEdit => {
            textEditorEdit.replace(
                vscode.window.activeTextEditor.document.lineAt( line ).range,
                text
            )
        })
    }

//
// ─── GENERATE ADDITIONAL SPACINGS ───────────────────────────────────────────────
//

    function generateAdditionalSpacingsForComments ( ) {
        let spacings =
            "\n" + generateIndentation( )
        if ( relativeIndentationSize < 2 )
            spacings += computeTabs( 1 )
        return spacings
    }

//
// ─── COMMENT GENERATION BODY ────────────────────────────────────────────────────
//

    function generateCommentWithFormula ( func ) {
        try {
            // basic information:
            loadEnvironmentalInformation( )

            // language specific parts:
            languageCommentSignSettings =
                getOneLineLanguageCommentSignForCurrentLanguage( )
            if ( languageCommentSignSettings === null ) {
                vscode.window.showInformationMessage(
                    "Comment Error: Kary Comments can't be used in language " + currentLanguageId + "."
                )
                return
            }

            // generate comment
            processCurrentLine( )

            // generate the comment
            let comment =
                func( )
            if ( comment === null )
                return

            // apply to editor
            replaceLine( currentLine, comment )

            // done!
            vscode.commands.executeCommand( 'cancelSelection' )

        } catch ( err ) {
            vscode.window.showInformationMessage(
                `Comment Error: "${ err.message }" at ${ err.lineNumber }`
            )
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
        const text =
            currentLineString.toUpperCase( ).trim( )
        const indentationText =
            generateIndentation( )
        const startingLineChars =
            repeat( commentLineCharacter , 3 )
        const tailingLineChars =
            repeat( commentLineCharacter, width - text.length - 5 )

        // line 1
        let result =
            `${ indentationText }${ languageCommentSignSettings.start }\n`

        // line 2
        result +=
            indentationText + languageCommentSignSettings.middle + " " + startingLineChars + " " + text + " " + tailingLineChars + "\n"

        // line 3
        result +=
            indentationText + languageCommentSignSettings.end + "\n"

        // done
        return result
    }

//
// ─── GENERATE REVERSE SECTION COMMENT ───────────────────────────────────────────
//

    function generateReverseSectionComments ( width ) {
        const text =
            currentLineString.toUpperCase( ).trim( )
        const indentationText =
            generateIndentation( )
        const startingLineChars =
            repeat( commentLineCharacter , 5 )
        const tailingLineChars =
            repeat( commentLineCharacter, width - text.length - 7 )

        // line 1
        let result =
            indentationText + languageCommentSignSettings.start + "\n"

        // line 2
        result +=
            indentationText + languageCommentSignSettings.middle + " " + tailingLineChars + " " + text + " " + startingLineChars + "\n"

        // line 3
        result +=
            indentationText + languageCommentSignSettings.end + "\n"

        // done
        return result
    }

//
// ─── GENERATE INSECTION COMMENTS ────────────────────────────────────────────────
//

    function generateInSectionComments ( ) {
        const text =
            currentLineString.toUpperCase( ).trim( )
        const indentationText =
            generateIndentation( )

        // line 1
        let result =
            indentationText + languageCommentSignSettings.start + "\n"

        // line 2
        result +=
            indentationText + languageCommentSignSettings.middle + " " + text + "\n"

        // line 3
        result +=
            indentationText + languageCommentSignSettings.end + "\n"

        // done
        return result
    }

//
// ─── ON GENERATE COMMENT ────────────────────────────────────────────────────────
//

    function onGenerateSectionComment ( kind = 'normal' ) {
        generateCommentWithFormula( ( ) => {
            // checking the input against the regex
            if ( !lineFormat.test( currentLineString ) ) {
                vscode.window.showInformationMessage( lineFormatErrorMessage )
                return null
            }

            // return comment...
            return generateCommentBasedOnIndentation( kind )
        })
    }

//
// ─── GENERATE COMMENT BASED ON INDENTATION ──────────────────────────────────────
//

    function generateCommentBasedOnIndentation ( kind ) {
        let comment
        const sectionCommentGenerator =
            ( kind === 'reverse'
                ? generateReverseSectionComments
                : generateSectionComment
                )

        switch ( relativeIndentationSize ) {
            case 0:
                comment = sectionCommentGenerator( 80 )
                break
            case 1:
                comment = sectionCommentGenerator( 65 )
                break
            default:
                comment = generateInSectionComments( )
                break
        }

        return comment + generateAdditionalSpacingsForComments( )
    }

// ────────────────────────────────────────────────────────────────────────────────





//
// ──────────────────────────────────────────────────────────────── III ──────────
//  :::::: L I N E   C O M M E N T : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────
//

//
// ─── GENERATE LINE COMMENT ──────────────────────────────────────────────────────
//

    function generateLineComment ( width ) {
        return generateSingleLineComment( repeat( commentLineCharacter, width ) )
    }

//
// ─── GENERATE SEPARATOR COMMENTS ────────────────────────────────────────────────
//

    function generateSeparatorComments ( ) {
        return generateSingleLineComment( "• • • • •" )
    }

//
// ─── GENERATE A SINGLE LINE COMMENT ─────────────────────────────────────────────
//

    function generateSingleLineComment ( commentText ) {
        const indentation =
            generateIndentation( )
        const shouldUseOneLineLook =
            ( languageCommentSignSettings.start === languageCommentSignSettings.end &&
              languageCommentSignSettings.start === languageCommentSignSettings.middle )

        if ( shouldUseOneLineLook )
            return  indentation + languageCommentSignSettings.start + " " + commentText + "\n"
        else
            return  indentation + languageCommentSignSettings.start.trim( ) + " " +
                    commentText + " " + languageCommentSignSettings.end.trim( ) + "\n"
    }

//
// ─── ON GENERATE LINE ───────────────────────────────────────────────────────────
//

    function onGenerateLineComment ( ) {
        generateCommentWithFormula( ( ) => {
            let line
            switch ( relativeIndentationSize ) {
                case 0:
                    return generateLineComment( 80 )
                case 1:
                    return generateLineComment( 65 )
                default:
                    return generateSeparatorComments( )
            }
        })
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

    function createFlagComment ( index ) {
        generateCommentWithFormula( ( ) => {
            // checking the input against the regex
            if ( !lineFormat.test( currentLineString ) ) {
                vscode.window.showInformationMessage( lineFormatErrorMessage )
                return null
            }

            // generating the comment
            return generateFlagCommentString( index )
        })
    }

//
// ─── GET NUMBER INPUT FROM USER ─────────────────────────────────────────────────
//

    function onGenerateFlagComment ( ) {
        // input
        const promptNumber = vscode.window.showInputBox({
            prompt: "Please give your flag number an index",
            value: "1",
            validateInput: ( value ) => {
                if ( /^\s*[0-9]*\s*$/.test( value ) )
                    return null
                else
                    return "Input must be a number."
            }
        })

        // prompt number
        promptNumber.then( value => {
            let index
            if ( value == null || value == undefined )
                index = 1
            else
                index = value
            createFlagComment( index )
        })
    }

//
// ─── GENERATE FLAG COMMENT ──────────────────────────────────────────────────────
//

    function generateFlagCommentString ( index ) {
        // info
        const text = makeFlagCommentText( currentLineString.toUpperCase( ).trim( ) )
        const indentationText = generateIndentation( )

        // line 1
        let comment =
            indentationText + languageCommentSignSettings.start + "\n"

        // line 2
        comment +=
            generateFlagCommentSecondLine( index , text.length )

        // line 3
        comment +=
            indentationText + languageCommentSignSettings.middle + "   :::::: " +
            text + ": :  :   :    :     :        :          :\n"

        // line 4
        comment +=
            indentationText + languageCommentSignSettings.middle + " " +
            repeat( commentLineCharacter , 50 + text.length ) + "\n"

        // line 5
        comment +=
            indentationText + languageCommentSignSettings.end + "\n\n"

        // line 7
        comment +=
            indentationText

        // done
        return comment
    }

//
// ─── GENERATE SECOND LINE ───────────────────────────────────────────────────────
//

    function generateFlagCommentSecondLine ( number , length ) {
        return  (
            generateIndentation( ) +
            languageCommentSignSettings.middle +
            " " +
            repeat( commentLineCharacter , length + 40 ) +
            " " +
            roman( number ) +
            " " +
            repeat( commentLineCharacter , 10 ) +
            "\n"
        )
    }

//
// ─── MAKE TITLE TEXT ────────────────────────────────────────────────────────────
//

    function makeFlagCommentText ( text ) {
        let title = ''
        for ( let index = 0; index < text.length; index++ )
            title += text[ index ] + " "
        return title
    }

//
// ─── ADJUST FLAG COMMENT NUMBERS ────────────────────────────────────────────────
//

    /**
     * This function re arranges all the flag comment numbers, so you don't
     * have to do it yourself.
     */
    function adjustFlagCommentNumbers ( ) {
        // disabled for now:
        return
    }

//
// ─── GENERATE RANGE FOR FLAG REPLACE ────────────────────────────────────────────
//

    function generateRangeForFlagReplace ( line, start, end ) {
        return new vscode.Range(
            new vscode.Position( line, start ),
            new vscode.Position( line, start + end - 1 )
        )
    }

// ────────────────────────────────────────────────────────────────────────────────