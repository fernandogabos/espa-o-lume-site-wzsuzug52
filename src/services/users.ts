import { supabase } from '@/lib/supabase/client'
import { Profile, InviteUserParams } from '@/types/auth'

export const getUsers = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Profile[]
}

export const inviteUser = async (params: InviteUserParams) => {
  const { data, error } = await supabase.functions.invoke('invite-user', {
    body: params,
  })
  if (error) throw error
  return data
}

export const updatePassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) throw error

  // Also update profile to set first_login_required to false
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ first_login_required: false })
      .eq('id', user.id)

    if (profileError) {
      console.error('Error updating profile:', profileError)
      // We don't throw here to not block the user flow if auth update succeeded
    }
  }
}
