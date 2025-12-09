import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

/**
 * INSTRUCTIONS TO INVOKE THIS FUNCTION FOR SPECIFIC USER CREATION:
 *
 * To create the administrative user 'fernando.gabos@innovagrupo.com.br' with the required role and credentials,
 * execute the following cURL command in your terminal.
 *
 * Make sure to replace <PROJECT_REF> and <SUPABASE_SERVICE_ROLE_KEY> with your actual project values.
 *
 * curl -i --location --request POST 'https://<PROJECT_REF>.supabase.co/functions/v1/create-admin-user' \
 *   --header 'Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>' \
 *   --header 'Content-Type: application/json' \
 *   --data '{
 *     "email": "fernando.gabos@innovagrupo.com.br",
 *     "password": "123456a!"
 *   }'
 *
 * This command will:
 * 1. Create the user in Supabase Auth.
 * 2. Mark the email as confirmed.
 * 3. Assign the 'admin' role to the user's profile.
 */

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with Service Role Key for admin privileges
    // This is required to bypass RLS and perform admin actions like createUser and updating profiles
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
    const { email, password } = await req.json()

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    console.log(`Attempting to create admin user: ${email}`)

    // 1. Create user in Auth using Admin API
    // We explicitly set email_confirm to true and assign admin role in metadata
    const { data: userData, error: createError } =
      await supabaseClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { role: 'admin' },
      })

    if (createError) {
      console.error(
        'Error creating user in Auth:',
        JSON.stringify(createError, null, 2),
      )
      // Return the complete and unaltered error message from Supabase API
      return new Response(
        JSON.stringify({
          error: createError.message,
          details: createError,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    const userId = userData.user.id
    console.log(`User successfully created in Auth with ID: ${userId}`)

    // 2. Create or Update Profile with admin role
    // This ensures the profile exists and has the correct role immediately
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
      console.error(
        'Error upserting profile:',
        JSON.stringify(profileError, null, 2),
      )
      // Return the complete and unaltered error message from Supabase API
      return new Response(
        JSON.stringify({
          error: profileError.message,
          details: profileError,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    console.log(
      `Profile successfully updated for user: ${userId} with admin privileges.`,
    )

    return new Response(
      JSON.stringify({
        message: `Admin user ${email} created successfully and role assigned.`,
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
        status: 500,
      },
    )
  }
})
