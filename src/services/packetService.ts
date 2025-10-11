import { supabase } from '../lib/supabase';
import type { PacketConfig, PacketGenerationResponse, SelectedDocument } from '../types';

export async function createPacket(
  projectId: string,
  fileName: string
): Promise<string> {
  const { data, error } = await supabase
    .from('packets')
    .insert({
      project_id: projectId,
      file_name: fileName,
      status: 'pending',
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating packet:', error);
    throw new Error('Failed to create packet');
  }

  return data.id;
}

export async function addDocumentsToPacket(
  packetId: string,
  documents: SelectedDocument[]
): Promise<void> {
  const packetDocuments = documents.map((doc, index) => ({
    packet_id: packetId,
    document_id: doc.id,
    document_order: index + 1,
  }));

  const { error } = await supabase
    .from('packet_documents')
    .insert(packetDocuments);

  if (error) {
    console.error('Error adding documents to packet:', error);
    throw new Error('Failed to add documents to packet');
  }
}

export async function updatePacketStatus(
  packetId: string,
  status: 'pending' | 'generating' | 'completed' | 'failed',
  result?: Partial<PacketGenerationResponse>
): Promise<void> {
  const updateData: Record<string, unknown> = { status };

  if (status === 'completed' || status === 'failed') {
    updateData.completed_at = new Date().toISOString();
  }

  if (result) {
    if (result.downloadUrl) updateData.download_url = result.downloadUrl;
    if (result.fileSize) updateData.file_size = result.fileSize;
    if (result.pageCount) updateData.page_count = result.pageCount;
    if (result.error) updateData.error_message = result.error;
  }

  const { error } = await supabase
    .from('packets')
    .update(updateData)
    .eq('id', packetId);

  if (error) {
    console.error('Error updating packet status:', error);
    throw new Error('Failed to update packet status');
  }
}

export async function generatePacket(
  config: PacketConfig
): Promise<PacketGenerationResponse> {
  try {
    const totalSize = config.documents.reduce((sum, doc) => sum + doc.fileSizeBytes, 0);
    const formatBytes = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const fileName = `MAXTERRA_${config.formData.projectName.replace(/\s+/g, '_')}_${
      new Date().toISOString().split('T')[0]
    }.pdf`;

    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-packet`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formData: config.formData,
        documents: config.documents,
        fileName,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate packet: ${response.statusText}`);
    }

    const result = await response.json();

    return {
      success: true,
      downloadUrl: result.downloadUrl,
      fileName,
      fileSize: formatBytes(totalSize),
      pageCount: config.documents.length * 3 + 1,
    };
  } catch (error) {
    console.error('Error generating packet:', error);
    throw error;
  }
}
