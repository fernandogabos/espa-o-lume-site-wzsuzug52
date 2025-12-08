import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log('Hello from create-admin-user!')

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with Service Role Key for admin privileges
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    )

    // Parse request body
    const { email, password, email_confirm } = await req.json()

    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    console.log(`Attempting to create admin user: ${email}`)

    // 1. Create user in Auth using Admin API
    const { data: userData, error: createError } =
      await supabaseClient.auth.admin.createUser({
        email,
        password,
        email_confirm: email_confirm ?? true,
        user_metadata: { role: 'admin' },
      })

    if (createError) {
      // Detailed logging for Auth creation error
      console.error(
        'Error creating user in Auth:',
        JSON.stringify(createError, null, 2),
      )
      throw createError
    }

    const userId = userData.user.id
    console.log(`User successfully created in Auth with ID: ${userId}`)

    // 2. Create or Update Profile with admin role and forced first login
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .upsert({
        id: userId,
        role: 'admin',
        first_login_required: true,
      })
      .select()
      .single()

    if (profileError) {
      // Detailed logging for Profile upsert error
      console.error(
        'Error upserting profile:',
        JSON.stringify(profileError, null, 2),
      )
      // We log the error but we don't necessarily want to rollback the auth creation in this simple script,
      // though in production you might want a transaction or cleanup.
      throw new Error(
        `User created but profile update failed: ${profileError.message}`,
      )
    }

    console.log(
      `Profile successfully updated for user: ${userId} with admin privileges.`,
    )

    return new Response(
      JSON.stringify({
        message: `Admin user ${email} created successfully`,
        user: userData.user,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error: any) {
    console.error('Error in create-admin-user function:', error)
    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred',
        details: error,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
