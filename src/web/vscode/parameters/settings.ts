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

  const legacyMode: boolean =
    commentConfigurations.get('legacy') ?? false;

  const levelOneCommentWidth: number =
    commentConfigurations.get('levelOneCommentWidth') ?? 80;

  const levelTwoCommentWidth: number =
    commentConfigurations.get('levelTwoCommentWidth') ?? 65;

  return {
    ornament,
    legacyMode,
    levelOneCommentWidth,
    levelTwoCommentWidth
  };
}