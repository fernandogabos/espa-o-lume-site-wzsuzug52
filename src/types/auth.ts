export type UserRole = 'admin' | 'editor'

export interface Profile {
  id: string
  role: UserRole
  first_login_required: boolean
  created_at: string
  updated_at: string
}

export interface InviteUserParams {
  email: string
  role: UserRole
}
