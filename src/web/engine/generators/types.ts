import * as protocols   from '../protocols';
import * as concepts    from '../concepts';
import * as validation  from '../validation';

// ─── Comment Generator Implementation Function ─────────────────────────── ✣ ─

/**
 * If presented with an error returns a string explaining the error
 * or returns `null` to indicate the absence of problems and therefore
 * givin the thumbs up sign.
 */
export type CommentVerifier =
  (context: concepts.Context) => validation.ValidationResult;

/**
 * Generates the comment
 */
export type CommentGenerator =
  (context: concepts.Context) => string;

// ─── Comment Generator Skeleton Construction Parameters ────────────────── ✣ ─

/** Parameters to establish the comment generator skeleton */
export interface CommentGeneratorSkeletonParams {
  contextVerifier:    CommentVerifier,
  commentGenerator:   CommentGenerator,
}

// ─── Generator Skeleton ────────────────────────────────────────────────── ✣ ─

export type GeneratorSkeleton = (
  userSettings:           protocols.UserSettings,
  editorParameters:       protocols.EditorParameters,
  languageConfiguration:  protocols.LanguageConfigurations,
) => string;
