import { supabase } from '../lib/supabase';
import type { SubmittalForm } from '../types';

export async function createProject(formData: SubmittalForm): Promise<string> {
  const { data, error } = await supabase
    .from('projects')
    .insert({
      submitted_to: formData.submittedTo,
      project_name: formData.projectName,
      project_number: formData.projectNumber || null,
      prepared_by: formData.preparedBy,
      phone_email: formData.phoneEmail,
      date: formData.date,
      status: formData.status,
      submittal_type: formData.submittalType,
      product_size: formData.productSize,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating project:', error);
    throw new Error('Failed to create project');
  }

  return data.id;
}

export async function updateProject(
  projectId: string,
  formData: Partial<SubmittalForm>
): Promise<void> {
  const updateData: Record<string, unknown> = {};

  if (formData.submittedTo) updateData.submitted_to = formData.submittedTo;
  if (formData.projectName) updateData.project_name = formData.projectName;
  if (formData.projectNumber !== undefined) updateData.project_number = formData.projectNumber;
  if (formData.preparedBy) updateData.prepared_by = formData.preparedBy;
  if (formData.phoneEmail) updateData.phone_email = formData.phoneEmail;
  if (formData.date) updateData.date = formData.date;
  if (formData.status) updateData.status = formData.status;
  if (formData.submittalType) updateData.submittal_type = formData.submittalType;
  if (formData.productSize) updateData.product_size = formData.productSize;

  const { error } = await supabase
    .from('projects')
    .update(updateData)
    .eq('id', projectId);

  if (error) {
    console.error('Error updating project:', error);
    throw new Error('Failed to update project');
  }
}
