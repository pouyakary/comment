import * as engine      from '..';
import * as languages   from '../../vscode/languages';
import * as parameters  from '../../vscode/parameters';
import * as tools       from '../../vscode/tools';
import * as validation  from '../validation';

// ─── Comment Generator Implementation Function ─────────────────────────── ✣ ─

export type UserSettings      = engine.protocols.UserSettings;
export type EditorParameters  = engine.protocols.EditorParameters;

/**
 * If presented with an error returns a string explaining the error
 * or returns `null` to indicate the absence of problems and therefore
 * givin the thumbs up sign.
 */
export type CommentVerifier =
  (context: engine.concepts.GeneratorContext) => validation.ValidationResult;

/**
 * Generates the comment
 */
export type CommentGenerator =
  (context: engine.concepts.GeneratorContext) => string;

// ─── Comment Generator Skeleton Construction Parameters ────────────────── ✣ ─

/** Parameters to establish the comment generator skeleton */
export interface CommentGeneratorSkeletonParams {
  contextVerifier:    CommentVerifier,
  commentGenerator:   CommentGenerator,
}

// ─── Comment Generation Skeleton ───────────────────────────────────────── ✣ ─

/**
 * This function is the factory for the comment creation. In creation of
 * every comment, there is a process of:
 *
 * 1. Scanning the environmental parameters and computing them.
 * 2. Loading the language definitions if supported and pushing an error
 *    otherwise.
 * 3. Forming the `engine.concepts.GeneratorContext`.
 * 4. Verifying if the inputs are valid (And showing error if they are not).
 * 5. Generating the comment based on the `GeneratorContext`.
 * 6. Adding additional spacing after the line
 * 7. Replacing the old line in the editor with the newly generated line(s).
 *
 * ---
 *
 * This function creates the base for the implementation of these
 * functions by performing the common tasks and leaving two things
 * for the implementation:
 *
 * 1. Implementation of a function that _verifies the `GeneratorContext`_
 * 2. Implementation of a function that _creates the comment based on
 *    the `GeneratorContext`_
 * ---
 *
 * @param skeletonParams the parameters object
 */
export function createCommentGenerationSkeleton(
  skeletonParams: CommentGeneratorSkeletonParams
) {
  // Remember: This creates a function that when triggered does the job...
  return () => {
    // Scanning and processing the environment and the input value
    const userSettings          = parameters.getUserSettings();
    const environmentalSettings = parameters.computeEnvironmentalSettings();

    // Getting the language configuration
    const languageConfig =
      languages.loadLanguageSettings(environmentalSettings.languageId);
    if (languageConfig === null) {
      tools.showError(`Language '${environmentalSettings.languageId} is not supported by Comment VI. Please make a issue in GitHub to add the support for it'`);
      return;
    }

    // Establish the GeneratorContext
    const context = new engine.concepts.GeneratorContext({
      userSettings:     userSettings,
      editorSettings:   environmentalSettings,
      languageConfig:   languageConfig,
    });

    // Checking the parameters
    const possibleError = skeletonParams.contextVerifier(context);
    if (possibleError) {
      tools.showError(possibleError);
      return;
    }

    // Computing the answer
    const generatedComment = skeletonParams.commentGenerator(context);

    // Generating additional whitespace
    const lineBreaks = '\n'.repeat(2);
    const spacesInTheLastLine =
      context.indentation.whitespaceBeforeFinalCursorPosition;

    // final product
    const finalProduct =
      generatedComment + lineBreaks + spacesInTheLastLine;

    // Performing the replace on editor
    tools.replaceLineWithCurrentSnippet(
      environmentalSettings.currentLineNumber,
      finalProduct,
    );
  };
}
