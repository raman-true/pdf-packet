import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function generateSamplePDF(
  title: string,
  fileName: string,
  pageCount: number,
  category: string
): Promise<void> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  for (let i = 0; i < pageCount; i++) {
    const page = pdfDoc.addPage([612, 792]);
    const { width, height } = page.getSize();

    page.drawText(title, {
      x: 50,
      y: height - 50,
      size: 24,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.4),
    });

    page.drawText(`Category: ${category}`, {
      x: 50,
      y: height - 80,
      size: 12,
      font: font,
      color: rgb(0.3, 0.3, 0.3),
    });

    page.drawLine({
      start: { x: 50, y: height - 90 },
      end: { x: width - 50, y: height - 90 },
      thickness: 1,
      color: rgb(0.7, 0.7, 0.7),
    });

    page.drawText(`Page ${i + 1} of ${pageCount}`, {
      x: 50,
      y: height - 120,
      size: 14,
      font: font,
      color: rgb(0.2, 0.2, 0.2),
    });

    const content = [
      'This is a sample document generated for testing purposes.',
      '',
      'In a production environment, this would contain the actual',
      'technical documentation, specifications, and data sheets',
      'for MAXTERRA\u00ae MgO Non-Combustible Floor Panels.',
      '',
      'Key Features:',
      '• Non-combustible construction',
      '• High structural performance',
      '• Environmental sustainability',
      '• ICC-ES certified',
      '',
      'For more information, visit www.nexgenbp.com',
    ];

    let yPos = height - 160;
    content.forEach((line) => {
      page.drawText(line, {
        x: 50,
        y: yPos,
        size: 11,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
      });
      yPos -= 20;
    });

    page.drawText('\u00a9 2025 NEXGEN Building Products, LLC', {
      x: 50,
      y: 30,
      size: 9,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });

    page.drawText(`${fileName}`, {
      x: width - 200,
      y: 30,
      size: 8,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });
  }

  const pdfBytes = await pdfDoc.save();
  const outputPath = join(process.cwd(), 'public', 'documents', fileName);
  writeFileSync(outputPath, pdfBytes);
  console.log(`Generated: ${fileName} (${pageCount} pages, ${(pdfBytes.length / 1024).toFixed(2)} KB)`);
}

async function main() {
  console.log('Generating sample PDF documents...\n');

  const documents = [
    {
      title: 'Installation Guide',
      fileName: 'Installation Guide - MAXTERRA™ MgO Non-Combustible Single-Layer Subfloor - V 1.02.pdf',
      pageCount: 21,
      category: 'Installation Guide',
    },
    {
      title: 'Technical Data Sheet (TDS)',
      fileName: 'TDS - MAXTERRA® MgO Non-Combustible Single Layer Structural Floor Panels 01-14-25 Version 1.2 Email (1) (1).pdf',
      pageCount: 2,
      category: 'Technical Data Sheet',
    },
    {
      title: 'ICC-ES Evaluation Report (ESR-5194)',
      fileName: 'ESR-5194 - MAXTERRA™ MgO Non-Combustible Single Layer Structural Floor Panels - June 2024 (4) (1).pdf',
      pageCount: 12,
      category: 'Evaluation Report',
    },
    {
      title: 'Safety Data Sheet (MSDS)',
      fileName: 'MSDS - MAXTERRA™ MgO Non-Combustible Single Layer Structural Floor Panels - Version 1 Sept 2024.pdf',
      pageCount: 11,
      category: 'Safety Data Sheet',
    },
    {
      title: 'LEED Credit Guide',
      fileName: 'LEED Credit Guide 7-16-25 (1).pdf',
      pageCount: 4,
      category: 'LEED Guide',
    },
  ];

  for (const doc of documents) {
    await generateSamplePDF(doc.title, doc.fileName, doc.pageCount, doc.category);
  }

  console.log('\n✓ All sample PDFs generated successfully!');
  console.log('\nTo use these in your application:');
  console.log('1. The PDFs are now in public/documents/');
  console.log('2. They will be served as static assets');
  console.log('3. The packet generator will merge them correctly');
}

main().catch(console.error);
