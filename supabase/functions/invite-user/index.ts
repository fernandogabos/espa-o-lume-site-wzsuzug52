import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, role } = await req.json()
    const tempPassword = '123456a!'

    // Create Supabase Admin Client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    )

    // Create user
    const { data: user, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: { role },
      })

    if (createError) {
      throw createError
    }

    // In a real world scenario, we would use a transactional email service here (e.g. Resend, SendGrid)
    // For this requirement, we are simulating the email sending.
    console.log(`
      [MOCK EMAIL]
      To: ${email}
      Subject: Bem-vindo ao Espaço Lume CMS
      Body: 
        Olá! Você foi convidado para gerenciar o site do Espaço Lume.
        Suas credenciais de acesso são:
        Email: ${email}
        Senha temporária: ${tempPassword}
        
        Por favor, faça login e altere sua senha imediatamente.
    `)

    return new Response(
      JSON.stringify({ user, message: 'User created and email sent' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
