import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';
import { convertToMarkdown } from '../converters/any-to-md';

export async function handleConvertToMarkdown(uri?: vscode.Uri): Promise<void> {
  const targetUri = uri || vscode.window.activeTextEditor?.document.uri;

  if (!targetUri) {
    vscode.window.showWarningMessage('Any Markdown Converter: No file selected.');
    return;
  }

  const ext = path.extname(targetUri.fsPath).toLowerCase();
  if (!ext || ext === '.md') {
    vscode.window.showWarningMessage(
      'Any Markdown Converter: This file is already Markdown or has no extension.'
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
      const basename = path.basename(targetUri.fsPath, ext);
      const dir = path.dirname(targetUri.fsPath);
      const outputPath = path.join(dir, `${basename}.md`);

      progress.report({ message: `Converting ${path.basename(targetUri.fsPath)}...` });

      try {
        const markdown = await convertToMarkdown(targetUri);

        await fs.writeFile(outputPath, markdown, 'utf-8');

        const config = vscode.workspace.getConfiguration('markdownConverter');
        const openAfter = config.get<boolean>('openAfterExport', true);

        if (openAfter) {
          const doc = await vscode.workspace.openTextDocument(outputPath);
          await vscode.window.showTextDocument(doc);
        } else {
          const choice = await vscode.window.showInformationMessage(
            `Converted to: ${path.basename(outputPath)}`,
            'Open',
            'Reveal in Explorer'
          );
          if (choice === 'Open') {
            const doc = await vscode.workspace.openTextDocument(outputPath);
            await vscode.window.showTextDocument(doc);
          } else if (choice === 'Reveal in Explorer') {
            await vscode.commands.executeCommand(
              'revealFileInOS',
              vscode.Uri.file(outputPath)
            );
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        vscode.window.showErrorMessage(`Any Markdown Converter: Conversion failed — ${msg}`);
      }
    }
  );
}
