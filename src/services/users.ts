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
  // 1. Update the password in auth.users
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) throw error

  // 2. Update profile to set first_login_required to false
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
      throw new Error(
        'Senha atualizada, mas houve um erro ao atualizar o perfil.',
      )
    }
  }
}
