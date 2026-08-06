import * as fs from 'fs/promises';
import { pandocLoader } from '../utils/pandoc-loader';
import type { ExportFormat } from '../types';

export async function convertMdWithPandoc(
  markdown: string,
  outputPath: string,
  format: ExportFormat
): Promise<void> {
  const outputFilename = `output.${format}`;
  const buffer = await pandocLoader.convert(markdown, format, outputFilename);
  await fs.writeFile(outputPath, buffer);
}
