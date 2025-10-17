import { PacketConfig, PacketGenerationResponse } from '../types';
import { createProject } from '../services/projectService';
import { createPacket, addDocumentsToPacket, updatePacketStatus } from '../services/packetService';

export async function generatePacket(
  config: PacketConfig
): Promise<PacketGenerationResponse> {
  try {
    const projectId = await createProject(config.formData);

    const fileName = `MAXTERRA_${config.formData.projectName.replace(/\s+/g, '_')}_${
      new Date().toISOString().split('T')[0]
    }.pdf`;

    const packetId = await createPacket(projectId, fileName);

    await addDocumentsToPacket(packetId, config.documents);

    await updatePacketStatus(packetId, 'generating');

    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-packet`;
    const frontendUrl = window.location.origin;

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
        frontendUrl,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate packet');
    }

    const result = await response.json();

    await updatePacketStatus(packetId, 'completed', result);

    return {
      success: true,
      downloadUrl: result.downloadUrl,
      fileName: result.fileName,
      fileSize: result.fileSize,
      pageCount: result.pageCount,
    };
  } catch (error) {
    console.error('Error generating packet:', error);
    throw error;
  }
}
