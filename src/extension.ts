import * as vscode from 'vscode';
import { handleConvertToMarkdown } from './commands/to-markdown';
import { handleConvertFromMarkdown } from './commands/from-markdown';
import { handlePreviewAsMarkdown } from './commands/preview';
import { pandocLoader } from './utils/pandoc-loader';

export function activate(context: vscode.ExtensionContext): void {
  const convertToMdCmd = vscode.commands.registerCommand(
    'markdownConverter.convertToMarkdown',
    handleConvertToMarkdown
  );

  const convertFromMdCmd = vscode.commands.registerCommand(
    'markdownConverter.convertFromMarkdown',
    handleConvertFromMarkdown
  );

  const previewCmd = vscode.commands.registerCommand(
    'markdownConverter.previewAsMarkdown',
    handlePreviewAsMarkdown
  );

  context.subscriptions.push(
    convertToMdCmd,
    convertFromMdCmd,
    previewCmd,
    { dispose: () => pandocLoader.dispose() }
  );
}

export function deactivate(): void {
  pandocLoader.dispose();
}
