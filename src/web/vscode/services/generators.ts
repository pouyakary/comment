import * as parameters  from '../parameters';
import * as engine      from '../../engine';
import * as languages   from '../languages';

// ─── Wrap Generator Function ───────────────────────────────────────────── ✣ ─

export interface GeneratorExecutionResult {
  lineNumber:   number,
  result:      string,
}

export function runGenerator(
  skeleton: engine.generators.GeneratorSkeleton
): GeneratorExecutionResult {
  const userSettings      = parameters.getUserSettings();
  const editorParameters  = parameters.computeEnvironmentalSettings();

  const languageConfig =
    languages.loadLanguageSettings(editorParameters.languageId);
  if (languageConfig === null) {
    throw Error(`Language '${editorParameters.languageId} is not supported. Please make an issue in GitHub to add the support for it.`);
  }

  return {
    lineNumber:   editorParameters.currentLineNumber,
    result:       skeleton(userSettings, editorParameters, languageConfig)
  };
}