import { supabase } from '@/lib/supabase/client'

const BUCKET_NAME = 'lume-assets'

export async function uploadImage(file: File): Promise<string> {
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('A imagem deve ter no máximo 5MB.')
  }

  // Sanitize filename and create a unique path
  const fileExt = file.name.split('.').pop()
  const fileName = file.name.replace(/[^a-zA-Z0-9]/g, '_')
  const filePath = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}_${fileName}.${fileExt}`

  // Upload to Supabase Storage using the SDK
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Supabase Storage Upload Error:', error)

    // Handle "Failed to fetch" specifically
    if (error.message === 'Failed to fetch') {
      throw new Error(
        'Falha na conexão ao enviar imagem. Verifique se você está conectado e se o bloqueador de anúncios não está interferindo.',
      )
    }

    // Handle specific bucket not found error
    if (error.message.includes('Bucket not found')) {
      throw new Error(
        'Erro de configuração: O bucket de armazenamento não foi encontrado.',
      )
    }

    // Handle permission errors (RLS)
    if (
      error.message.includes('new row violates row-level security policy') ||
      (error as any).statusCode === '403'
    ) {
      throw new Error(
        'Permissão negada. Você precisa estar logado como administrador para enviar imagens.',
      )
    }

    throw new Error(`Erro no upload: ${error.message}`)
  }

  // Get the public URL
  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath)

  return publicUrlData.publicUrl
}
