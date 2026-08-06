import * as vscode from 'vscode';
import * as path from 'path';
import { convertToMarkdown } from '../converters/any-to-md';
import { SUPPORTED_INPUT_EXTENSIONS } from '../types';

export async function handlePreviewAsMarkdown(uri?: vscode.Uri): Promise<void> {
  const targetUri = uri || vscode.window.activeTextEditor?.document.uri;

  if (!targetUri) {
    vscode.window.showWarningMessage('Any Markdown Converter: No file selected.');
    return;
  }

  const ext = path.extname(targetUri.fsPath).toLowerCase();
  if (!SUPPORTED_INPUT_EXTENSIONS.has(ext)) {
    vscode.window.showWarningMessage(
      `Any Markdown Converter: Unsupported format "${ext}" for preview.`
    );
    return;
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Any Markdown Converter',
      cancellable: false,
    },
    async (progress) => {
      progress.report({ message: `Converting ${path.basename(targetUri.fsPath)} for preview...` });

      try {
        const markdown = await convertToMarkdown(targetUri);

        const doc = await vscode.workspace.openTextDocument({
          content: markdown,
          language: 'markdown',
        });

        await vscode.window.showTextDocument(doc, {
          viewColumn: vscode.ViewColumn.Beside,
          preview: true,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        vscode.window.showErrorMessage(`Any Markdown Converter: Preview failed — ${msg}`);
      }
    }
  );
}
