import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCMS } from '@/contexts/CMSContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Plus, Search, Filter } from 'lucide-react'
import { BoardColumn } from '@/components/admin/crm/BoardColumn'
import { CardDetailSheet } from '@/components/admin/crm/CardDetailSheet'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

export default function CRMBoard() {
  const { boardId } = useParams()
  const navigate = useNavigate()
  const { crm, addColumn, moveTask, moveColumn } = useCMS()
  const [isAddingColumn, setIsAddingColumn] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTask, setSelectedTask] = useState<string | null>(null)

  // Filters
  const [filters, setFilters] = useState({
    priority: [] as string[],
    labels: [] as string[],
  })

  const board = crm.boards.find((b) => b.id === boardId)

  if (!board) {
    return <div className="p-8">Quadro não encontrado</div>
  }

  const columns = crm.columns
    .filter((c) => c.boardId === boardId)
    .sort((a, b) => a.order - b.order)

  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault()
    if (newColumnTitle.trim()) {
      addColumn(board.id, newColumnTitle)
      setNewColumnTitle('')
      setIsAddingColumn(false)
    }
  }

  // Custom Drag & Drop Logic
  const handleDragStart = (
    e: React.DragEvent,
    type: 'column' | 'task',
    id: string,
    fromId?: string,
  ) => {
    e.dataTransfer.setData('type', type)
    e.dataTransfer.setData('id', id)
    if (fromId) e.dataTransfer.setData('fromId', fromId)
  }

  const handleDrop = (
    e: React.DragEvent,
    targetId: string,
    targetType: 'column' | 'task',
  ) => {
    e.preventDefault()
    const type = e.dataTransfer.getData('type')
    const id = e.dataTransfer.getData('id')
    const fromId = e.dataTransfer.getData('fromId') // columnId for task

    if (type === 'task' && targetType === 'column') {
      // Drop task on column (append)
      moveTask(id, targetId, 9999)
    } else if (type === 'column' && targetType === 'column') {
      // Reorder columns (simplified: swap or move to index)
      // Finding index of target
      const targetIndex = columns.findIndex((c) => c.id === targetId)
      if (targetIndex !== -1) moveColumn(id, targetIndex)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin/crm')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-lume-deep-blue flex items-center gap-2">
              {board.title}
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: board.color }}
              />
            </h1>
            <p className="text-sm text-muted-foreground">{board.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tarefas..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-60">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Prioridade</h4>
                  <div className="flex flex-col gap-2">
                    {['high', 'medium', 'low'].map((p) => (
                      <div key={p} className="flex items-center gap-2">
                        <Checkbox
                          id={`filter-${p}`}
                          checked={filters.priority.includes(p)}
                          onCheckedChange={(checked) => {
                            setFilters((prev) => ({
                              ...prev,
                              priority: checked
                                ? [...prev.priority, p]
                                : prev.priority.filter((i) => i !== p),
                            }))
                          }}
                        />
                        <Label htmlFor={`filter-${p}`} className="capitalize">
                          {p}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Board Area */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex h-full gap-4 pb-4 min-w-max">
          {columns.map((column) => (
            <BoardColumn
              key={column.id}
              column={column}
              searchQuery={searchQuery}
              filters={filters}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onTaskClick={setSelectedTask}
            />
          ))}

          {/* Add Column Button */}
          <div className="w-80 shrink-0">
            {isAddingColumn ? (
              <div className="bg-white p-3 rounded-lg border shadow-sm">
                <form onSubmit={handleAddColumn}>
                  <Input
                    autoFocus
                    placeholder="Nome da lista"
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    className="mb-2"
                  />
                  <div className="flex gap-2">
                    <Button type="submit" size="sm">
                      Adicionar
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsAddingColumn(false)}
                    >
                      X
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <Button
                variant="ghost"
                className="w-full justify-start bg-white/50 hover:bg-white"
                onClick={() => setIsAddingColumn(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar outra lista
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Task Detail Sheet */}
      <CardDetailSheet
        taskId={selectedTask}
        open={!!selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
      />
    </div>
  )
}
