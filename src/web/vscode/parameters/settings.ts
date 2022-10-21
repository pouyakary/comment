import * as vscode from 'vscode';
import * as engine from '../../engine';

// ─── Get User Settings ─────────────────────────────────────────────────── ✣ ─

export function getUserSettings(): engine.protocols.UserSettings {
  const commentConfigurations =
    vscode.workspace.getConfiguration('comment');

  let ornament = '';
  if (commentConfigurations.get('fancy') ?? false) {
    ornament = commentConfigurations.get('ornament') ?? '';
  }

  const rootCommentWidth: number =
    commentConfigurations.get('rootCommentWidth') ?? 80;

  const indentationLevelWidthDifference: number =
    commentConfigurations.get('indentationLevelWidthDifference') ?? 8;

  const codeStartsAtOneMoreLevelOfIndentation: boolean =
    commentConfigurations.get('codeStartsAtOneMoreLevelOfIndentation') ?? false;

  const onlyRenderOrnamentInRootLevel: boolean =
    commentConfigurations.get('onlyRenderOrnamentInRootLevel') ?? true;

  return {
    codeStartsAtOneMoreLevelOfIndentation: codeStartsAtOneMoreLevelOfIndentation,
    indentationLevelWidthDifference:  indentationLevelWidthDifference,
    onlyRenderOrnamentInRootLevel:    onlyRenderOrnamentInRootLevel,
    ornament:                         ornament,
    rootCommentWidth:                 rootCommentWidth,
  };
}