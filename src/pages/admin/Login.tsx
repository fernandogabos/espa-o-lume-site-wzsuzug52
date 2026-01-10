import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Flame, Lock, Mail, Loader2, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { user, profile, signIn, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loginError, setLoginError] = useState<string | null>(null)

  // Handle redirects when user is authenticated
  useEffect(() => {
    console.log('[Login] Auth State Check:', {
      userId: user?.id,
      profile,
      authLoading,
    })

    if (user && profile && !authLoading) {
      if (profile.first_login_required) {
        navigate('/admin/change-password')
      } else {
        navigate('/admin')
      }
    } else if (user && !profile && !authLoading) {
      // Edge case: User exists but profile failed to load
      console.warn(
        'User authenticated but profile not found. Check RLS policies.',
      )
    }
  }, [user, profile, authLoading, navigate])

  // Manual Login Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setLoginError(null)

    console.log(`[Login] Attempting manual login for email: ${email}`)

    try {
      const { error } = await signIn(email, password)

      if (error) {
        console.error('[Login] Error:', error)
        let message = error.message || 'Verifique suas credenciais'
        let title = 'Erro ao entrar'

        // Enhanced error handling for connection issues
        if (
          message.includes('Failed to fetch') ||
          message.includes('NetworkError') ||
          message.includes('network')
        ) {
          message =
            'Não foi possível conectar ao servidor. Verifique sua conexão com a internet ou se a configuração do projeto (URL/Chaves) está correta.'
          title = 'Erro de Conexão'
        } else if (message.includes('Database error')) {
          message = 'Erro interno do banco de dados. Contate o suporte.'
          title = 'Erro de Sistema'
        } else if (message.includes('Invalid login credentials')) {
          message = 'Email ou senha incorretos. Por favor, tente novamente.'
          title = 'Credenciais Inválidas'
        }

        setLoginError(message)
        toast({
          title: title,
          description: message,
          variant: 'destructive',
        })
      } else {
        console.log('[Login] Success for:', email)
      }
    } catch (err: any) {
      console.error('[Login] Unexpected Error:', err)
      let message = err.message || 'Ocorreu um erro inesperado'

      if (
        message.includes('Failed to fetch') ||
        message.includes('NetworkError')
      ) {
        message =
          'Erro grave de conexão. O servidor pode estar indisponível ou as credenciais de ambiente incorretas.'
      }

      setLoginError(message)
      toast({
        title: 'Erro Inesperado',
        description: message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Render Loading Screen
  if (authLoading || (user && !profile)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="bg-lume-mint/20 p-6 rounded-full animate-pulse mb-6">
          <Flame className="w-16 h-16 text-lume-deep-blue" />
        </div>
        <h2 className="text-2xl font-display font-bold text-lume-deep-blue mb-2">
          Espaço Lume
        </h2>
        <div className="flex items-center text-lume-deep-blue/80 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Conectando ao sistema...</span>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          Isso pode levar alguns segundos.
        </p>
      </div>
    )
  }

  // Render Standard Login Form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg border-lume-gray/20">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto bg-lume-mint/10 p-4 rounded-full w-fit">
            <Flame className="w-8 h-8 text-lume-deep-blue" />
          </div>
          <div>
            <CardTitle className="text-2xl font-display text-lume-deep-blue">
              Espaço Lume CMS
            </CardTitle>
            <CardDescription>
              Área restrita para administradores
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {loginError && (
              <Alert variant="destructive" className="animate-fade-in-down">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Problema de Acesso</AlertTitle>
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Email corporativo"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Senha"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-lume-deep-blue hover:bg-lume-deep-blue/90 text-white font-medium transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Autenticando...
                </>
              ) : (
                'Entrar no Sistema'
              )}
            </Button>

            <div className="text-center">
              <p className="text-xs text-muted-foreground mt-4">
                Em caso de problemas, contate o administrador do sistema.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
