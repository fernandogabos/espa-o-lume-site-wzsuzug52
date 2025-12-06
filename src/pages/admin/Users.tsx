import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { getUsers, inviteUser } from '@/services/users'
import { Profile } from '@/types/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { UserPlus, Shield, Mail, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function Users() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [inviteLoading, setInviteLoading] = useState(false)
  const [newUserData, setNewUserData] = useState({ email: '', role: 'editor' })

  const { profile: currentProfile } = useAuth()

  const fetchData = async () => {
    try {
      const data = await getUsers()
      setProfiles(data)
    } catch (error) {
      console.error(error)
      toast.error('Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setInviteLoading(true)

    try {
      await inviteUser({
        email: newUserData.email,
        role: newUserData.role as 'admin' | 'editor',
      })

      toast.success('Convite enviado com sucesso!')
      setIsInviteOpen(false)
      setNewUserData({ email: '', role: 'editor' })
      fetchData()
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Erro ao enviar convite')
    } finally {
      setInviteLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-lume-deep-blue">
            Gestão de Usuários
          </h2>
          <p className="text-muted-foreground">
            Administre quem tem acesso ao painel do site.
          </p>
        </div>

        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <Button className="bg-lume-deep-blue hover:bg-lume-deep-blue/90">
              <UserPlus className="w-4 h-4 mr-2" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Convidar Novo Usuário</DialogTitle>
              <DialogDescription>
                O usuário receberá um e-mail com uma senha temporária.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleInvite} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="usuario@exemplo.com"
                    className="pl-9"
                    value={newUserData.email}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Função</Label>
                <Select
                  value={newUserData.role}
                  onValueChange={(val) =>
                    setNewUserData({ ...newUserData, role: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="editor">Editor (Conteúdo)</SelectItem>
                    <SelectItem value="admin">Administrador (Total)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                className="w-full bg-lume-mint text-lume-deep-blue hover:bg-lume-mint/90"
                disabled={inviteLoading}
              >
                {inviteLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Convite'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuários Cadastrados</CardTitle>
          <CardDescription>
            Lista de todos os usuários com acesso ao sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-lume-mint" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Cadastro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {profile.id}
                      {profile.id === currentProfile?.id && (
                        <span className="ml-2 text-lume-deep-blue font-bold">
                          (Você)
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="capitalize">
                      <div className="flex items-center gap-2">
                        {profile.role === 'admin' ? (
                          <Shield className="w-4 h-4 text-lume-deep-blue" />
                        ) : (
                          <div className="w-4 h-4" />
                        )}
                        {profile.role}
                      </div>
                    </TableCell>
                    <TableCell>
                      {profile.first_login_required ? (
                        <Badge
                          variant="outline"
                          className="border-yellow-500 text-yellow-600"
                        >
                          Pendente (Senha)
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-green-500 text-green-600"
                        >
                          Ativo
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(profile.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
