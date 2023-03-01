import * as vscode     from 'vscode';
import * as engine     from '../../engine';
import * as parameters from '.';

// ─── Get User Settings ─────────────────────────────────────────────────── ✣ ─

export function getUserSettings(
  environmentalSettings?: parameters.EnvironmentComputationParameters
): engine.protocols.UserSettings {

  const commentConfigurations =
    vscode.workspace.getConfiguration('comment');

  let ornament = '';
  if (commentConfigurations.get('fancy') ?? false) {
    ornament = commentConfigurations.get('ornament') ?? '';
  }
  if (environmentalSettings?.forcedOrnament) {
    ornament = environmentalSettings.forcedOrnament;
  }

  const rootCommentWidth: number =
    commentConfigurations.get('rootCommentWidth') ?? 80;

  const indentationLevelWidthDifference: number =
    commentConfigurations.get('indentationLevelWidthDifference') ?? 8;

  const codeStartsAtOneMoreLevelOfIndentation: boolean =
    commentConfigurations.get('codeStartsAtOneMoreLevelOfIndentation') ?? false;

  const onlyRenderOrnamentInRootLevel: boolean =
    environmentalSettings?.forcedOrnament !== undefined
      ? false
      : commentConfigurations.get('onlyRenderOrnamentInRootLevel') ??  true;

  const additionalNewLines: number = 
    commentConfigurations.get('additionalNewLines') ?? 2;

  return {
    codeStartsAtOneMoreLevelOfIndentation: codeStartsAtOneMoreLevelOfIndentation,
    indentationLevelWidthDifference:  indentationLevelWidthDifference,
    onlyRenderOrnamentInRootLevel:    onlyRenderOrnamentInRootLevel,
    ornament:                         ornament,
    rootCommentWidth:                 rootCommentWidth,
    additionalNewLines:               additionalNewLines,
  };
}
