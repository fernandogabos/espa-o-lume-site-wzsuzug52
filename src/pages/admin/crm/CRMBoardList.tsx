import { useState } from 'react'
import { useCMS } from '@/contexts/CMSContext'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Star, Plus, Trash2, MoreVertical, Kanban } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export default function CRMBoardList() {
  const { crm, addBoard, updateBoard, deleteBoard } = useCMS()
  const [isNewBoardOpen, setIsNewBoardOpen] = useState(false)
  const [newBoardData, setNewBoardData] = useState({
    title: '',
    description: '',
    color: '#94D1B4',
  })

  const handleCreateBoard = () => {
    addBoard(newBoardData)
    setIsNewBoardOpen(false)
    setNewBoardData({ title: '', description: '', color: '#94D1B4' })
  }

  const sortedBoards = [...crm.boards].sort((a, b) => {
    // Favorites first
    if (a.isFavorite && !b.isFavorite) return -1
    if (!a.isFavorite && b.isFavorite) return 1
    return 0
  })

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-lume-deep-blue">
            Quadros
          </h2>
          <p className="text-muted-foreground">
            Gerencie seus projetos e leads em quadros estilo Kanban.
          </p>
        </div>

        <Dialog open={isNewBoardOpen} onOpenChange={setIsNewBoardOpen}>
          <DialogTrigger asChild>
            <Button className="bg-lume-deep-blue hover:bg-lume-deep-blue/90">
              <Plus className="w-4 h-4 mr-2" />
              Novo Quadro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Quadro</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nome do Quadro</Label>
                <Input
                  value={newBoardData.title}
                  onChange={(e) =>
                    setNewBoardData({ ...newBoardData, title: e.target.value })
                  }
                  placeholder="Ex: Gestão de Leads"
                />
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={newBoardData.description}
                  onChange={(e) =>
                    setNewBoardData({
                      ...newBoardData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Descrição breve do propósito deste quadro"
                />
              </div>
              <div className="space-y-2">
                <Label>Cor de Identificação</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="color"
                    value={newBoardData.color}
                    onChange={(e) =>
                      setNewBoardData({
                        ...newBoardData,
                        color: e.target.value,
                      })
                    }
                    className="w-12 h-10 p-1"
                  />
                  <span className="text-sm text-muted-foreground">
                    {newBoardData.color}
                  </span>
                </div>
              </div>
              <Button onClick={handleCreateBoard} className="w-full">
                Criar Quadro
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedBoards.map((board) => (
          <Card
            key={board.id}
            className="hover:shadow-lg transition-all group relative overflow-hidden border-t-4"
            style={{ borderTopColor: board.color }}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">
                  <Link
                    to={`/admin/crm/board/${board.id}`}
                    className="hover:underline"
                  >
                    {board.title}
                  </Link>
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'h-8 w-8',
                      board.isFavorite
                        ? 'text-yellow-500'
                        : 'text-gray-300 hover:text-yellow-500',
                    )}
                    onClick={() =>
                      updateBoard(board.id, { isFavorite: !board.isFavorite })
                    }
                  >
                    <Star
                      className={cn(
                        'w-4 h-4',
                        board.isFavorite && 'fill-current',
                      )}
                    />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => deleteBoard(board.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2 h-10">
                {board.description || 'Sem descrição'}
              </p>
            </CardContent>
            <CardFooter className="bg-gray-50/50 border-t p-4">
              <Link to={`/admin/crm/board/${board.id}`} className="w-full">
                <Button
                  variant="outline"
                  className="w-full group-hover:border-lume-deep-blue group-hover:text-lume-deep-blue"
                >
                  <Kanban className="w-4 h-4 mr-2" />
                  Abrir Quadro
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
