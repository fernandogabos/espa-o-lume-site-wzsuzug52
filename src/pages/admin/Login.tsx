import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCMS } from '@/contexts/CMSContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Flame, Lock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Login() {
  const [password, setPassword] = useState('')
  const { login, isAuthenticated } = useCMS()
  const navigate = useNavigate()
  const { toast } = useToast()

  if (isAuthenticated) {
    navigate('/admin')
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (login(password)) {
      toast({ title: 'Login realizado com sucesso!' })
      navigate('/admin')
    } else {
      toast({
        title: 'Senha incorreta',
        description: "Tente 'admin123'",
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto bg-lume-mint/20 p-4 rounded-full w-fit">
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
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Senha de acesso"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-lume-deep-blue hover:bg-lume-deep-blue/90"
            >
              Entrar
            </Button>
            <p className="text-xs text-center text-gray-400">
              Dica: A senha é admin123
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
