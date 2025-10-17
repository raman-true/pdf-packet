import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadDocuments() {
  const documentsDir = join(process.cwd(), 'public', 'documents');
  const files = readdirSync(documentsDir).filter(file => file.endsWith('.pdf'));

  console.log(`Found ${files.length} PDF files to upload...`);

  for (const fileName of files) {
    try {
      const filePath = join(documentsDir, fileName);
      const fileBuffer = readFileSync(filePath);

      console.log(`Uploading ${fileName}...`);

      const { data, error } = await supabase.storage
        .from('source-documents')
        .upload(fileName, fileBuffer, {
          contentType: 'application/pdf',
          upsert: true,
        });

      if (error) {
        console.error(`Error uploading ${fileName}:`, error);
      } else {
        console.log(`✓ Uploaded ${fileName}`);

        const { data: urlData } = supabase.storage
          .from('source-documents')
          .getPublicUrl(fileName);

        console.log(`  Public URL: ${urlData.publicUrl}`);
      }
    } catch (err) {
      console.error(`Error processing ${fileName}:`, err);
    }
  }

  console.log('\nUpload complete!');
}

uploadDocuments();
