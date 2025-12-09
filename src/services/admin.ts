import { supabase } from '@/lib/supabase/client'

/**
 * Invokes the 'create-admin-user' edge function to create a new admin user.
 *
 * @param email The email of the new admin user.
 * @param password The password for the new admin user.
 * @returns The response data from the edge function.
 */
export const createAdminUser = async (email: string, password: string) => {
  const { data, error } = await supabase.functions.invoke('create-admin-user', {
    body: { email, password },
  })

  if (error) {
    throw error
  }

  // Check if the function returned an application-level error
  if (data && data.error) {
    throw new Error(data.error)
  }

  return data
}
