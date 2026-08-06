import * as fs from 'fs/promises';

interface ParsedTable {
  headers: string[];
  alignments: ('left' | 'center' | 'right' | null)[];
  rows: string[][];
}

function parseMarkdownTables(markdown: string): ParsedTable[] {
  const tables: ParsedTable[] = [];
  const lines = markdown.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.trim().startsWith('|') && i + 1 < lines.length) {
      const nextLine = lines[i + 1];
      if (nextLine && nextLine.match(/^\|[\s:|-]+\|$/)) {
        const headers = parsePipeRow(line);
        const alignments = parseAlignmentRow(nextLine);
        const rows: string[][] = [];
        let j = i + 2;

        while (j < lines.length && lines[j].trim().startsWith('|')) {
          rows.push(parsePipeRow(lines[j]));
          j++;
        }

        tables.push({ headers, alignments, rows });
        i = j;
        continue;
      }
    }
    i++;
  }

  return tables;
}

function parsePipeRow(line: string): string[] {
  return line
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function parseAlignmentRow(line: string): ('left' | 'center' | 'right' | null)[] {
  return parsePipeRow(line).map((cell) => {
    const trimmed = cell.replace(/\s/g, '');
    if (trimmed.startsWith(':') && trimmed.endsWith(':')) return 'center';
    if (trimmed.endsWith(':')) return 'right';
    if (trimmed.startsWith(':')) return 'left';
    return null;
  });
}

export async function convertMdToXlsx(
  markdown: string,
  outputPath: string
): Promise<void> {
  const ExcelJS = await import('exceljs');
  const workbook = new ExcelJS.Workbook();
  const tables = parseMarkdownTables(markdown);

  if (tables.length === 0) {
    const sheet = workbook.addWorksheet('Sheet1');
    const lines = markdown.split('\n').filter((l) => l.trim());
    lines.forEach((line, idx) => {
      sheet.getCell(idx + 1, 1).value = line;
    });
  } else {
    tables.forEach((table, tableIdx) => {
      const sheetName = tables.length === 1 ? 'Sheet1' : `Table ${tableIdx + 1}`;
      const sheet = workbook.addWorksheet(sheetName);

      const headerRow = sheet.addRow(table.headers);
      headerRow.font = { bold: true };
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF4472C4' },
        };
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.border = {
          bottom: { style: 'medium', color: { argb: 'FF2F5496' } },
        };
      });

      for (const row of table.rows) {
        sheet.addRow(row.map(parseNumericValue));
      }

      table.alignments.forEach((alignment, colIdx) => {
        const col = sheet.getColumn(colIdx + 1);
        if (alignment) {
          col.alignment = { horizontal: alignment };
        }
        col.width = Math.max(
          table.headers[colIdx]?.length || 8,
          ...table.rows.map((r) => (r[colIdx] || '').length),
          8
        ) + 2;
      });
    });
  }

  await workbook.xlsx.writeFile(outputPath);
}

function parseNumericValue(value: string): string | number {
  const num = Number(value);
  if (!isNaN(num) && value.trim() !== '') {
    return num;
  }
  return value;
}
