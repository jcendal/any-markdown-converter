import * as fs from 'fs/promises';

export async function convertMdToDocx(
  markdown: string,
  outputPath: string
): Promise<void> {
  const { convertMarkdownToBuffer } = await import('@mohtasham/md-to-docx');
  const buffer = await convertMarkdownToBuffer(markdown);
  await fs.writeFile(outputPath, buffer);
}
