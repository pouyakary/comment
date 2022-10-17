import * as types       from './types';
import * as concepts    from '../concepts';

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
 *
 * @returns A function that takes the Skeleton parameters
 *          and either generates a result or returns an error.
 */
export function createCommentGenerationSkeleton(
  skeletonParams: types.CommentGeneratorSkeletonParams
): types.GeneratorSkeleton {

  // Remember: This creates a function that when triggered does the job...
  return (userSettings, editorParameters, languageConfig): string => {

    // Establish the GeneratorContext
    const context = new concepts.GeneratorContext({
      userSettings:     userSettings,
      editorSettings:   editorParameters,
      languageConfig:   languageConfig,
    });

    // Checking the parameters
    const possibleError = skeletonParams.contextVerifier(context);
    if (possibleError) {
      throw Error(possibleError);
    }

    // Computing the answer
    const generatedComment = skeletonParams.commentGenerator(context);

    // Starting whitespace
    if (editorParameters.onlyRenderTheMainLine) {
      return context.language.wrapResultInComment(
        context.indentation,
        generatedComment
      );
    }

    // Generating additional whitespace
    const lineBreaks = '\n'.repeat(1);
    const cursorIndentation =
      context.indentation.whitespaceBeforeFinalCursorPosition;
    const additionalWhitespace = lineBreaks + cursorIndentation;

    const mainLine = context.language.wrapResultInComment(
      context.indentation,
      generatedComment,
    );

    return mainLine + '\n' + additionalWhitespace;
  };
}
