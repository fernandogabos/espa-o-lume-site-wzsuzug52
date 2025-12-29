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

  let uploadError: any = null
  let retryCount = 0
  const maxRetries = 3

  while (retryCount < maxRetries) {
    try {
      uploadError = null // Reset error for this attempt

      // Upload to Supabase Storage using the SDK
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) {
        uploadError = error
        // Only retry on network errors or timeouts
        if (
          error.message === 'Failed to fetch' ||
          error.message.includes('timeout')
        ) {
          retryCount++
          console.warn(`Upload attempt ${retryCount} failed. Retrying...`)
          if (retryCount < maxRetries) {
            // Exponential backoff: 1s, 2s, 3s
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * retryCount),
            )
            continue
          }
        }
        break // Break for other errors or max retries reached
      }

      // Success - Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath)

      return publicUrlData.publicUrl
    } catch (err: any) {
      uploadError = err
      // Catch unexpected errors (like network exceptions if SDK throws)
      if (
        err.message === 'Failed to fetch' ||
        err.message?.includes('timeout')
      ) {
        retryCount++
        console.warn(
          `Upload attempt ${retryCount} failed with exception. Retrying...`,
        )
        if (retryCount < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount))
          continue
        }
      }
      break
    }
  }

  // Handle errors
  if (uploadError) {
    console.error('Supabase Storage Upload Error:', uploadError)

    // Handle "Failed to fetch" specifically
    if (uploadError.message === 'Failed to fetch') {
      throw new Error(
        'Falha na conexão ao enviar imagem. Verifique se você está conectado e se o bloqueador de anúncios não está interferindo.',
      )
    }

    // Handle specific bucket not found error
    if (uploadError.message.includes('Bucket not found')) {
      throw new Error(
        'Erro de configuração: O bucket de armazenamento não foi encontrado.',
      )
    }

    // Handle permission errors (RLS)
    if (
      uploadError.message.includes(
        'new row violates row-level security policy',
      ) ||
      (uploadError as any).statusCode === '403'
    ) {
      throw new Error(
        'Permissão negada. Você precisa estar logado como administrador para enviar imagens.',
      )
    }

    throw new Error(`Erro no upload: ${uploadError.message}`)
  }

  // Should not happen if loop logic is correct and success returns
  throw new Error('Erro desconhecido ao tentar enviar a imagem.')
}
