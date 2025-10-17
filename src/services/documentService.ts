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
    name: doc.name || doc.title,
    description: doc.description || '',
    fileSize: doc.file_size_text || formatBytes(doc.file_size || 0),
    fileSizeBytes: doc.file_size || 0,
    url: getDocumentUrl(doc.storage_path || doc.file_path),
    storagePath: doc.storage_path || doc.file_path,
    category: (doc.category || doc.document_type || 'Technical Data Sheet') as Document['category'],
    thumbnail: doc.thumbnail_url || undefined,
  }));
}

function getDocumentUrl(storagePath: string | null | undefined): string {
  if (!storagePath) {
    console.warn('No storage path provided for document');
    return '';
  }

  // If the path starts with /documents/, it's a public static asset
  if (storagePath.startsWith('/documents/')) {
    return storagePath;
  }

  // Otherwise, try to get from Supabase storage
  try {
    const { data } = supabase.storage.from('source-documents').getPublicUrl(storagePath);
    return data.publicUrl;
  } catch (error) {
    console.error('Error getting document URL:', error);
    return storagePath;
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
