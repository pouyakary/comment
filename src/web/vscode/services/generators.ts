import * as vscode      from 'vscode';
import * as parameters  from '../parameters';
import * as engine      from '../../engine';
import * as languages   from '../languages';

// ─── Result Type ───────────────────────────────────────────────────────── ✣ ─

export interface GeneratorExecutionResult {
  lineNumber:   number,
  result:       string,
}

// ─── Wrap Generator Function ───────────────────────────────────────────── ✣ ─

export function executeGenerator(
  skeleton:                   engine.generators.GeneratorSkeleton,
  editorComputationOptions?:  parameters.EnvironmentComputationParameters,
): GeneratorExecutionResult {

  const userSettings      = parameters.getUserSettings();
  const editorParameters  = parameters.computeEnvironmentalParameters(
    editorComputationOptions,
  );

  const languageConfig =
    languages.loadLanguageSettings(editorParameters.languageId);
  if (languageConfig === null) {
    throw Error(`Language '${editorParameters.languageId} is not supported. Please make an issue in GitHub to add the support for it.`);
  }

  const result = skeleton(userSettings, editorParameters, languageConfig);

  return {
    lineNumber:   editorParameters.currentLineNumber,
    result:       result,
  };
}
