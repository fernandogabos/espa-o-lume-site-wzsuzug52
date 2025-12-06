const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
const BUCKET_NAME = 'lume-assets'

export async function uploadImage(file: File): Promise<string> {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error(
      'Configuração do Supabase ausente. Verifique as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.',
    )
  }

  // Sanitize filename and create a unique path
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
  const filePath = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}_${cleanFileName}`

  // Upload to Supabase Storage using standard Fetch API
  const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${filePath}`

  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': file.type,
      'x-upsert': 'false',
    },
    body: file,
  })

  if (!response.ok) {
    let errorMessage = 'Falha no upload'
    try {
      const errorData = await response.json()
      if (errorData && errorData.message) errorMessage = errorData.message
    } catch {
      // ignore json parse error
    }
    throw new Error(`Erro no upload: ${errorMessage}`)
  }

  // Return the public URL
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${filePath}`
}
