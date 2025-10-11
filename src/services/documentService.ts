import { supabase } from '../lib/supabase';
import type { Document } from '../types';

export async function fetchDocuments(): Promise<Document[]> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching documents:', error);
    throw new Error('Failed to fetch documents');
  }

  return data.map((doc) => ({
    id: doc.id,
    name: doc.name,
    description: doc.description,
    fileSize: doc.file_size,
    fileSizeBytes: doc.file_size_bytes,
    url: getDocumentUrl(doc.storage_path),
    storagePath: doc.storage_path,
    category: doc.category as Document['category'],
    thumbnail: doc.thumbnail_url || undefined,
  }));
}

function getDocumentUrl(storagePath: string): string {
  const { data } = supabase.storage.from('source-documents').getPublicUrl(storagePath);
  return data.publicUrl;
}
