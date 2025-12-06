import { useState, useEffect } from 'react'
import { useCMS } from '@/contexts/CMSContext'
import { Task, Priority } from '@/types/crm'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Calendar,
  CheckSquare,
  AlignLeft,
  Tag,
  Trash2,
  User,
  MessageSquare,
  Plus,
  Clock,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface CardDetailSheetProps {
  taskId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CardDetailSheet({
  taskId,
  open,
  onOpenChange,
}: CardDetailSheetProps) {
  const { crm, updateTask, currentUser } = useCMS()
  const [commentText, setCommentText] = useState('')
  const [newChecklistItem, setNewChecklistItem] = useState('')

  const task = taskId ? crm.tasks.find((t) => t.id === taskId) : null
  const column = task ? crm.columns.find((c) => c.id === task.columnId) : null

  if (!task || !column) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Tarefa não encontrada</SheetTitle>
            <SheetDescription>
              A tarefa que você tentou acessar não existe ou foi removida.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    )
  }

  const handleAddComment = () => {
    if (!commentText.trim()) return
    const newComment = {
      id: Math.random().toString(36).substr(2, 9),
      text: commentText,
      userId: currentUser.id,
      userName: currentUser.name,
      createdAt: new Date().toISOString(),
    }
    updateTask(task.id, { comments: [...task.comments, newComment] })
    setCommentText('')
  }

  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newChecklistItem.trim()) return
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      text: newChecklistItem,
      completed: false,
    }
    updateTask(task.id, { checklist: [...task.checklist, newItem] })
    setNewChecklistItem('')
  }

  const toggleChecklistItem = (itemId: string) => {
    const updatedChecklist = task.checklist.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item,
    )
    updateTask(task.id, { checklist: updatedChecklist })
  }

  const deleteChecklistItem = (itemId: string) => {
    updateTask(task.id, {
      checklist: task.checklist.filter((i) => i.id !== itemId),
    })
  }

  // Safe checklist percentage calculation
  const completedCount = task.checklist.filter((i) => i.completed).length
  const totalCount = task.checklist.length
  const percentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl w-full flex flex-col p-0 gap-0 bg-gray-50/50">
        <SheetHeader className="p-6 bg-white border-b">
          <SheetTitle className="text-xl flex items-start gap-2">
            <div className="flex-1">
              <Input
                className="text-xl font-bold border-none shadow-none px-0 h-auto focus-visible:ring-0 p-0"
                value={task.title}
                onChange={(e) => updateTask(task.id, { title: e.target.value })}
              />
              <div className="text-sm font-normal text-muted-foreground mt-1 flex items-center gap-2">
                na lista{' '}
                <span className="underline decoration-dotted">
                  {column.title}
                </span>
              </div>
            </div>
          </SheetTitle>
          <SheetDescription className="sr-only">
            Detalhes da tarefa
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* Description */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-semibold text-gray-700">
                  <AlignLeft className="w-5 h-5" />
                  <h3>Descrição</h3>
                </div>
                <Textarea
                  value={task.description}
                  onChange={(e) =>
                    updateTask(task.id, { description: e.target.value })
                  }
                  placeholder="Adicione uma descrição detalhada..."
                  className="min-h-[120px] resize-none bg-white"
                />
              </div>

              {/* Checklist */}
              <div className="space-y-4">
                <div className="flex items-center justify-between font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-5 h-5" />
                    <h3>Checklist</h3>
                  </div>
                  {task.checklist.length > 0 && (
                    <span className="text-xs font-normal text-muted-foreground">
                      {percentage}% concluído
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                {task.checklist.length > 0 && (
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-lume-mint transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  {task.checklist.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 group"
                    >
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={() => toggleChecklistItem(item.id)}
                      />
                      <span
                        className={cn(
                          'flex-1 text-sm',
                          item.completed &&
                            'line-through text-muted-foreground',
                        )}
                      >
                        {item.text}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deleteChecklistItem(item.id)}
                      >
                        <Trash2 className="w-3 h-3 text-red-400" />
                      </Button>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddChecklistItem} className="flex gap-2">
                  <Input
                    value={newChecklistItem}
                    onChange={(e) => setNewChecklistItem(e.target.value)}
                    placeholder="Adicionar item..."
                    className="h-8 text-sm bg-white"
                  />
                  <Button type="submit" size="sm" className="h-8">
                    Adicionar
                  </Button>
                </form>
              </div>

              {/* Comments */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-semibold text-gray-700">
                  <MessageSquare className="w-5 h-5" />
                  <h3>Comentários</h3>
                </div>

                <div className="space-y-4">
                  {task.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-lume-deep-blue/10 flex items-center justify-center text-lume-deep-blue font-bold text-xs">
                        {comment.userName.charAt(0)}
                      </div>
                      <div className="flex-1 bg-white p-3 rounded-lg border shadow-sm">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-sm">
                            {comment.userName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-lume-mint/20 flex items-center justify-center text-lume-mint font-bold text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Escreva um comentário..."
                      className="bg-white min-h-[80px]"
                    />
                    <Button
                      size="sm"
                      onClick={handleAddComment}
                      disabled={!commentText.trim()}
                    >
                      Comentar
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Actions */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs uppercase text-muted-foreground font-bold">
                  Prioridade
                </Label>
                <Select
                  value={task.priority}
                  onValueChange={(val: Priority) =>
                    updateTask(task.id, { priority: val })
                  }
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase text-muted-foreground font-bold">
                  Etiquetas
                </Label>
                <div className="flex flex-wrap gap-2">
                  {task.labels.map((color) => (
                    <div
                      key={color}
                      className="h-6 w-12 rounded cursor-pointer ring-2 ring-offset-1 ring-transparent hover:ring-gray-300"
                      style={{ backgroundColor: color }}
                      onClick={() =>
                        updateTask(task.id, {
                          labels: task.labels.filter((l) => l !== color),
                        })
                      }
                    />
                  ))}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 w-6 p-0 bg-gray-100"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2">
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          '#94D1B4',
                          '#AFD9FF',
                          '#2F4F6F',
                          '#FFD700',
                          '#EF4444',
                          '#F97316',
                          '#8B5CF6',
                          '#EC4899',
                        ].map((color) => (
                          <div
                            key={color}
                            className="h-8 w-8 rounded cursor-pointer hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                            onClick={() => {
                              if (!task.labels.includes(color)) {
                                updateTask(task.id, {
                                  labels: [...task.labels, color],
                                })
                              }
                            }}
                          />
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase text-muted-foreground font-bold">
                  Datas
                </Label>
                {task.createdAt && (
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Criado em {new Date(task.createdAt).toLocaleDateString()}
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-xs uppercase text-muted-foreground font-bold">
                  Ações
                </Label>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    // In a real app we'd trigger a delete confirmation
                    // For now just close, as delete needs context function not passed here
                    onOpenChange(false)
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Excluir Tarefa
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
