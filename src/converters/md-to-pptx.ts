import * as fs from 'fs/promises';

interface SlideContent {
  title?: string;
  body: string[];
  notes?: string;
}

function parseMarkdownToSlides(markdown: string): SlideContent[] {
  const slideTexts = markdown.split(/^---$/m);
  const slides: SlideContent[] = [];

  for (const slideText of slideTexts) {
    const trimmed = slideText.trim();
    if (!trimmed) continue;

    const lines = trimmed.split('\n');
    let title: string | undefined;
    const body: string[] = [];
    const notes: string[] = [];
    let inNotes = false;

    for (const line of lines) {
      if (line.match(/^#+\s/)) {
        if (!title) {
          title = line.replace(/^#+\s*/, '');
        } else {
          body.push(line);
        }
      } else if (line.match(/^Notes?:/i) || line.match(/^<!--\s*notes?/i)) {
        inNotes = true;
      } else if (inNotes) {
        notes.push(line);
      } else {
        body.push(line);
      }
    }

    slides.push({
      title,
      body: body.filter((l) => l.trim()),
      notes: notes.length > 0 ? notes.join('\n') : undefined,
    });
  }

  if (slides.length === 0) {
    slides.push({
      title: 'Untitled',
      body: markdown.split('\n').filter((l) => l.trim()),
    });
  }

  return slides;
}

export async function convertMdToPptx(
  markdown: string,
  outputPath: string
): Promise<void> {
  const pptxgen = (await import('pptxgenjs')).default;
  const pres = new pptxgen();

  pres.layout = 'LAYOUT_WIDE';

  const slides = parseMarkdownToSlides(markdown);

  for (const slideContent of slides) {
    const slide = pres.addSlide();

    if (slideContent.title) {
      slide.addText(slideContent.title, {
        x: 0.5,
        y: 0.3,
        w: '90%',
        h: 1,
        fontSize: 28,
        bold: true,
        color: '1a1a2e',
      });
    }

    if (slideContent.body.length > 0) {
      const bodyText = slideContent.body
        .map((line) => {
          if (line.match(/^[-*]\s/)) {
            return { text: line.replace(/^[-*]\s/, '• '), options: { bullet: false } };
          }
          return { text: line, options: {} };
        })
        .map((item) => item.text)
        .join('\n');

      slide.addText(bodyText, {
        x: 0.5,
        y: slideContent.title ? 1.5 : 0.5,
        w: '90%',
        h: slideContent.title ? 4.0 : 5.0,
        fontSize: 16,
        color: '333333',
        valign: 'top',
      });
    }

    if (slideContent.notes) {
      slide.addNotes(slideContent.notes);
    }
  }

  const buffer = (await pres.write({ outputType: 'nodebuffer' })) as Buffer;
  await fs.writeFile(outputPath, buffer);
}
