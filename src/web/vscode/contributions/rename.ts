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
      'comment.vi.renameSectionComment',
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
  const extractionResult = engine.extraction.extractCommentContent(
    scanningParameters,
    languageConfiguration.chars,
  );
  if (extractionResult === null) {
    tools.showError('Not a section comment.');
    return;
  }

  // Ask user for new comment content
  const newCommentContent = await vscode.window.showInputBox({
      prompt:   "🌺 Write the new comment content.",
      value:    extractionResult.content.toLowerCase(),

      validateInput (value) {
          if (engine.validation.nameFormat.test(value)) {
              return null;
          }
          return engine.validation.nameValidationErrorMessage;
      }
  });

  if (newCommentContent === undefined) {
    return;
  }

  // Parameters
  const generationParameters: parameters.EnvironmentComputationParameters = {
    justRenderTheMainLine:  true,
    forcedLineContent:      extractionResult.indentation + newCommentContent,
  };

  // Generated result
  const finalProduct = services.executeGenerator(
    engine.generators.generateSectionComment,
    generationParameters
  );

  // replacing
  tools.replaceLineWithCurrentSnippet(
    finalProduct.lineNumber,
    finalProduct.result,
  );
}

// ─── Extract Current Content ───────────────────────────────────────────── ✣ ─


