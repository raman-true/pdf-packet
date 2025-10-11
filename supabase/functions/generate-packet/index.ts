import { createClient } from 'npm:@supabase/supabase-js@2';
import { PDFDocument, StandardFonts, rgb } from 'npm:pdf-lib@1.17.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface FormData {
  submittedTo: string;
  projectName: string;
  projectNumber?: string;
  preparedBy: string;
  phoneEmail: string;
  date: string;
  status: Record<string, boolean>;
  submittalType: Record<string, boolean>;
  productSize: string;
}

interface Document {
  id: string;
  name: string;
  storagePath?: string;
}

interface RequestBody {
  formData: FormData;
  documents: Document[];
  fileName: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body: RequestBody = await req.json();
    const { formData, documents, fileName } = body;

    const mergedPdf = await PDFDocument.create();
    mergedPdf.setTitle(`MAXTERRA Submittal - ${formData.projectName}`);
    mergedPdf.setAuthor(formData.preparedBy);
    mergedPdf.setCreationDate(new Date());

    const helveticaFont = await mergedPdf.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await mergedPdf.embedFont(StandardFonts.HelveticaBold);

    const coverPage = mergedPdf.addPage([612, 792]);
    const { width, height } = coverPage.getSize();

    let yPosition = height - 80;

    coverPage.drawText('MAXTERRA', {
      x: 50,
      y: yPosition,
      size: 36,
      font: helveticaBold,
      color: rgb(0.1, 0.1, 0.4),
    });

    yPosition -= 40;
    coverPage.drawText('Submittal Package', {
      x: 50,
      y: yPosition,
      size: 24,
      font: helveticaFont,
      color: rgb(0.2, 0.2, 0.2),
    });

    yPosition -= 60;
    coverPage.drawLine({
      start: { x: 50, y: yPosition },
      end: { x: width - 50, y: yPosition },
      thickness: 2,
      color: rgb(0.1, 0.1, 0.4),
    });

    yPosition -= 40;
    const addField = (label: string, value: string) => {
      coverPage.drawText(label, {
        x: 50,
        y: yPosition,
        size: 12,
        font: helveticaBold,
        color: rgb(0.2, 0.2, 0.2),
      });
      coverPage.drawText(value, {
        x: 200,
        y: yPosition,
        size: 12,
        font: helveticaFont,
        color: rgb(0.3, 0.3, 0.3),
      });
      yPosition -= 25;
    };

    addField('Submitted To:', formData.submittedTo);
    addField('Project Name:', formData.projectName);
    if (formData.projectNumber) {
      addField('Project Number:', formData.projectNumber);
    }
    addField('Prepared By:', formData.preparedBy);
    addField('Contact:', formData.phoneEmail);
    addField('Date:', formData.date);
    addField('Product Size:', formData.productSize);

    yPosition -= 20;
    coverPage.drawText('Status:', {
      x: 50,
      y: yPosition,
      size: 12,
      font: helveticaBold,
      color: rgb(0.2, 0.2, 0.2),
    });
    yPosition -= 20;

    const statusLabels: Record<string, string> = {
      forReview: 'For Review',
      forRecord: 'For Record',
      forApproval: 'For Approval',
      forInformationOnly: 'For Information Only',
    };

    Object.entries(formData.status).forEach(([key, checked]) => {
      if (checked) {
        coverPage.drawText(`[X] ${statusLabels[key] || key}`, {
          x: 70,
          y: yPosition,
          size: 11,
          font: helveticaFont,
          color: rgb(0.3, 0.3, 0.3),
        });
        yPosition -= 20;
      }
    });

    yPosition -= 10;
    coverPage.drawText('Included Documents:', {
      x: 50,
      y: yPosition,
      size: 12,
      font: helveticaBold,
      color: rgb(0.2, 0.2, 0.2),
    });
    yPosition -= 25;

    documents.forEach((doc, index) => {
      coverPage.drawText(`${index + 1}. ${doc.name}`, {
        x: 70,
        y: yPosition,
        size: 11,
        font: helveticaFont,
        color: rgb(0.3, 0.3, 0.3),
      });
      yPosition -= 20;
    });

    coverPage.drawText('(c) 2025 NEXGEN Building Products, LLC', {
      x: 50,
      y: 50,
      size: 10,
      font: helveticaFont,
      color: rgb(0.5, 0.5, 0.5),
    });

    for (const doc of documents) {
      if (!doc.storagePath) continue;

      try {
        const { data: fileData, error: downloadError } = await supabase.storage
          .from('source-documents')
          .download(doc.storagePath);

        if (downloadError) {
          console.error(`Error downloading ${doc.name}:`, downloadError);
          continue;
        }

        const arrayBuffer = await fileData.arrayBuffer();
        const sourcePdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      } catch (error) {
        console.error(`Error processing document ${doc.name}:`, error);
      }
    }

    const pdfBytes = await mergedPdf.save();

    const storagePath = `packets/${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from('generated-packets')
      .upload(storagePath, pdfBytes, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Failed to upload packet: ${uploadError.message}`);
    }

    const { data: urlData } = supabase.storage
      .from('generated-packets')
      .getPublicUrl(storagePath);

    return new Response(
      JSON.stringify({
        success: true,
        downloadUrl: urlData.publicUrl,
        fileName,
        fileSize: `${(pdfBytes.length / 1024 / 1024).toFixed(2)} MB`,
        pageCount: mergedPdf.getPageCount(),
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error generating packet:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate packet',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
