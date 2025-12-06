import { supabase } from '@/lib/supabase/client'

const BUCKET_NAME = 'lume-assets'

export async function uploadImage(file: File): Promise<string> {
  // Sanitize filename and create a unique path
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
  const filePath = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}_${cleanFileName}`

  // Upload to Supabase Storage using the SDK
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Supabase Storage Upload Error:', error)

    // Handle specific bucket not found error for better UX
    if (error.message.includes('Bucket not found')) {
      throw new Error(
        'Erro de configuração: O bucket de armazenamento não foi encontrado.',
      )
    }

    throw new Error(`Erro no upload: ${error.message}`)
  }

  // Get the public URL
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)

  return data.publicUrl
}
