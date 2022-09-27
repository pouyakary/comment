
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

    const vscode        = require( 'vscode' )
    const roman         = require( './roman.js' )
    const settingsTable = require('./dictionary.js')

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

    var legacyMode  = false
    var fancyMode   = false
    var signature   = '✣'

    // Information for processing...
    var linesFirstSpacing
    var realIndentationSize
    var relativeIndentationSize

//
// ─── BODY ───────────────────────────────────────────────────────────────────────
//

    exports.activate = function activate ( context ) {
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

        getConfigurations()
    }

//
// ─── GET CONFIGURATIONS ─────────────────────────────────────────────────────────
//

    function getConfigurations ( ) {
        const commentConfigurations = vscode.workspace.getConfiguration("comment")
        if (commentConfigurations === undefined || commentConfigurations === null) {
            return
        }

        const legacyConfig = commentConfigurations.get("legacy")
        if (legacyConfig && legacyConfig === true) {
            legacyMode = true
        }

        const fancyConfig = commentConfigurations.get("fancy")
        if (fancyConfig && fancyConfig === true) {
            fancyMode = true
        }

        const signatureConfig = commentConfigurations.get("signature")
        if (signatureConfig && signatureConfig !== '') {
            signature = signatureConfig
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
        if ( legacyMode && !languageCommentSignSettings.sensitive ) {
            let spacings =
                "\n" + generateIndentation( )
            if ( relativeIndentationSize < 2 )
                spacings += computeTabs( 1 )
            return spacings
        }
        return "\n"
    }

//
// ─── COMMENT GENERATION BODY ────────────────────────────────────────────────────
//

    function generateCommentWithFormula ( func ) {
        try {
            // basic information:
            loadEnvironmentalInformation( )

            // language settings
            languageCommentSignSettings =
                settingsTable( currentLanguageId )
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
// ─── ALL CAPS ───────────────────────────────────────────────────────────────────
//

    function formatTitle ( text ) {
        if (legacyMode) {
            return text.toUpperCase().trim()
        }
        const words = text.toLowerCase().trim().split(/\s+/)
        const allCapsWords = words.map( word => {
            let copy = [...word]
            copy[0] = copy[0].toUpperCase()
            return copy.join("")
        })
        return allCapsWords.join(" ")
    }

//
// ─── GENERATE COMMENT ───────────────────────────────────────────────────────────
//

    function generateSectionComment ( width ) {
        const text =
            formatTitle(currentLineString)
        const indentationText =
            generateIndentation( )
        const startingLineChars =
            repeat( commentLineCharacter , 3 )
        const fancyModeSpacing =
            fancyMode ? 3 + signature.length : 0
        const tailingLineChars =
            repeat( commentLineCharacter, width - text.length - 6 - languageCommentSignSettings.chars.middle.length - fancyModeSpacing)
        const sensitive =
            legacyMode && languageCommentSignSettings.sensitive

        // line 1
        let result = ''

        if ( sensitive )
            result =
                `${ indentationText }${ languageCommentSignSettings.chars.start }\n`

        // line 2
        result +=
            ( indentationText
            + languageCommentSignSettings.chars.middle
            + " "
            + startingLineChars
            + " "
            + text
            + " "
            + tailingLineChars
            + (fancyMode ? " " + signature + " " + commentLineCharacter : '')
            + "\n"
            )

        // line 3
        if ( sensitive )
            result +=
                indentationText + languageCommentSignSettings.chars.end + "\n"

        // done
        return result
    }

//
// ─── GENERATE REVERSE SECTION COMMENT ───────────────────────────────────────────
//

    function generateReverseSectionComments ( width ) {
        const text =
            formatTitle(currentLineString)
        const indentationText =
            generateIndentation( )
        const startingLineChars =
            repeat( commentLineCharacter , 5 )
        const tailingLineChars =
            repeat( commentLineCharacter, width - text.length - 8 - languageCommentSignSettings.chars.middle.length )
        const sensitive =
            legacyMode && languageCommentSignSettings.sensitive

        // line 1
        let result = ''

        if ( sensitive )
            result =
                `${ indentationText }${ languageCommentSignSettings.chars.start }\n`

        // line 2
        result +=
            indentationText + languageCommentSignSettings.chars.middle + " " + tailingLineChars + " " + text + " " + startingLineChars + "\n"

        // line 3
        if ( sensitive )
            result +=
                indentationText + languageCommentSignSettings.chars.end + "\n"

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
        let result = ""
        if ( !languageCommentSignSettings.sensitive )
            result = indentationText + languageCommentSignSettings.chars.start + "\n"

        // line 2
        result +=
            indentationText + languageCommentSignSettings.chars.middle + " " + text + "\n"

        // line 3
        if ( !languageCommentSignSettings.sensitive )
            result +=
                indentationText + languageCommentSignSettings.chars.end + "\n"

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
        return generateSingleLineComment( repeat( commentLineCharacter, width - 1 - languageCommentSignSettings.chars.middle.length ) )
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
            ( languageCommentSignSettings.chars.start === languageCommentSignSettings.chars.end &&
              languageCommentSignSettings.chars.start === languageCommentSignSettings.chars.middle )

        if ( shouldUseOneLineLook )
            return  indentation + languageCommentSignSettings.chars.start + " " + commentText + "\n"
        else
            return  indentation + languageCommentSignSettings.chars.start.trim( ) + " " +
                    commentText + " " + languageCommentSignSettings.chars.end.trim( ) + "\n"
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
            indentationText + languageCommentSignSettings.chars.start + "\n"

        // line 2
        comment +=
            generateFlagCommentSecondLine( index , text.length )

        // line 3
        comment +=
            indentationText + languageCommentSignSettings.chars.middle + "   :::::: " +
            text + ": :  :   :    :     :        :          :\n"

        // line 4
        comment +=
            indentationText + languageCommentSignSettings.chars.middle + " " +
            repeat( commentLineCharacter , 50 + text.length ) + "\n"

        // line 5
        comment +=
            indentationText + languageCommentSignSettings.chars.end + "\n\n"

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
            languageCommentSignSettings.chars.middle +
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