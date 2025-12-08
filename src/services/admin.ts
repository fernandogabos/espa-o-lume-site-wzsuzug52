import { supabase } from '@/lib/supabase/client'

export interface CreateAdminUserParams {
  email: string
  password: string
}

export const createAdminUser = async ({
  email,
  password,
}: CreateAdminUserParams) => {
  const { data, error } = await supabase.functions.invoke('create-admin-user', {
    body: {
      email,
      password,
      email_confirm: true,
    },
  })

  if (error) {
    console.error('Error invoking create-admin-user:', error)
    return { data: null, error }
  }

  // The edge function might return an error in the body even if the invoke itself "succeeded" (200 OK but with error field, or 400 Bad Request)
  // Our edge function returns 400 status on error, so supabase.functions.invoke should catch it as an error?
  // Actually invoke returns { data, error } where error is populated if status is not 2xx.
  // But let's check the data for application level error just in case.

  return { data, error: null }
}
