import * as vscode      from 'vscode';
import * as engine 		  from '../../engine';
import * as tools  		  from '../tools';
import * as services 	  from '../services';
import * as parameters  from '../parameters';
import * as languages   from '../languages';

// ─── Register Rename Provider ──────────────────────────────────────────── ✣ ─

export function registerRenameProviders(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'comment.renameTitleComment',
      renameCommand,
    ),
  );
}

// ─── Rename Command ────────────────────────────────────────────────────── ✣ ─

async function renameCommand() {
  // Editor Parameters
  const scanningParameters = parameters.computeEnvironmentalParameters();

  // Language Configuration
  const languageConfiguration = languages.loadLanguageSettings(
    scanningParameters.languageId
  );
  if (languageConfiguration === null) {
    tools.showError(
      `Language '${scanningParameters.languageId} 'is not supported.`
    );
    return;
  }

  // Extracting the information
  const language = new engine.concepts.Language(languageConfiguration);
  const extractionResult = engine.extraction.extractCommentContent(
    scanningParameters,
    language,
  );
  if (extractionResult === null) {
    tools.showError('Not a title comment.');
    return;
  }

  // Ask user for new comment content
  const newContent = await vscode.window.showInputBox({
    prompt:   "🌺 Give Your Comment A New Title.",
    value:    extractionResult.content.toLowerCase(),

    validateInput (value) {
      if (engine.validation.nameFormat.test(value)) {
        return null;
      }
      return engine.validation.nameValidationErrorMessage;
    }
  });

  if (newContent === undefined) {
    return;
  }

  const ornament = extractionResult.ornament !== ''
        ? extractionResult.ornament
        : undefined;

  // Parameters
  const generationParameters: parameters.EnvironmentComputationParameters = {
    justRenderTheMainLine:  true,
    forcedLineContent:      extractionResult.indentation + newContent,
    forcedOrnament:         ornament,
  };

  // Generated result
  const finalProduct = services.executeGenerator(
    engine.generators.generateTitleComment,
    generationParameters
  );

  // replacing
  await tools.replaceLineWithCurrentSnippet(
    finalProduct.lineNumber,
    finalProduct.result,
  );

  // moving to the end of the line
  const capitalizedTitle = engine.toolkit.capitalizeSentence(newContent);
  const indexOfTitle     = finalProduct.result.indexOf(capitalizedTitle);
  const endingIndex      = indexOfTitle + capitalizedTitle.length;

  const selectionPosition = new vscode.Position(
    finalProduct.lineNumber,
    endingIndex,
  );

  vscode.window.activeTextEditor!.selection = new vscode.Selection(
    selectionPosition,
    selectionPosition,
  );
}
