import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { Profile } from '@/types/auth'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  refreshProfile: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId: string) => {
    console.log('[Auth] fetchProfile started for userId:', userId)
    try {
      // Updated to use .single() to strictly fetch one profile as requested
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('[Auth] Error fetching profile:', error)
        console.error('[Auth] Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        })

        // Handle case where profile does not exist (PGRST116: JSON object requested, multiple (or no) rows returned)
        if (error.code === 'PGRST116') {
          console.log(
            '[Auth] Profile missing (PGRST116), attempting to create...',
          )

          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
              {
                id: userId,
                role: 'editor',
                first_login_required: true,
              },
            ])
            .select()
            .single()

          if (createError) {
            console.error('[Auth] Error creating profile:', createError)
            setProfile(null)
          } else {
            console.log('[Auth] Profile created successfully:', newProfile)
            setProfile(newProfile as Profile)
          }
        } else {
          setProfile(null)
        }
        console.log('[Auth] fetchProfile finished (with error path)')
        return
      }

      if (data) {
        console.log('[Auth] Profile fetched successfully:', data)
        setProfile(data as Profile)
      }
      console.log('[Auth] fetchProfile finished (success path)')
    } catch (e) {
      console.error('[Auth] Exception in fetchProfile:', e)
      setProfile(null)
    }
  }

  useEffect(() => {
    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        // Note: onAuthStateChange can be triggered multiple times.
        // We ensure loading is false only after profile fetch attempt.
        fetchProfile(session.user.id).finally(() => {
          setLoading(false)
        })
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchProfile(session.user.id)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    })
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    setProfile(null)
    return { error }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  const value = {
    user,
    session,
    profile,
    signUp,
    signIn,
    signOut,
    refreshProfile,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
