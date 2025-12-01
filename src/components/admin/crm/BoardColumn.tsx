import { useState } from 'react'
import { useCMS } from '@/contexts/CMSContext'
import { Column, Task } from '@/types/crm'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MoreHorizontal, Plus, Trash2, Edit2 } from 'lucide-react'
import { TaskCard } from './TaskCard'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface BoardColumnProps {
  column: Column
  searchQuery: string
  filters: { priority: string[]; labels: string[] }
  onDragStart: (
    e: React.DragEvent,
    type: 'column' | 'task',
    id: string,
    fromId?: string,
  ) => void
  onDrop: (
    e: React.DragEvent,
    targetId: string,
    targetType: 'column' | 'task',
  ) => void
  onDragOver: (e: React.DragEvent) => void
  onTaskClick: (taskId: string) => void
}

export function BoardColumn({
  column,
  searchQuery,
  filters,
  onDragStart,
  onDrop,
  onDragOver,
  onTaskClick,
}: BoardColumnProps) {
  const { crm, addTask, updateColumn } = useCMS()
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleEditValue, setTitleEditValue] = useState(column.title)

  const tasks = crm.tasks
    .filter((t) => t.columnId === column.id)
    .filter((t) => {
      // Search Filter
      if (
        searchQuery &&
        !t.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false
      // Priority Filter
      if (filters.priority.length > 0 && !filters.priority.includes(t.priority))
        return false
      return true
    })
    .sort((a, b) => a.order - b.order)

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTaskTitle.trim()) {
      addTask({
        columnId: column.id,
        title: newTaskTitle,
        priority: 'medium',
      })
      setNewTaskTitle('')
      setIsAddingTask(false)
    }
  }

  const handleTitleUpdate = () => {
    if (titleEditValue.trim() !== column.title) {
      updateColumn(column.id, { title: titleEditValue })
    }
    setIsEditingTitle(false)
  }

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, 'column', column.id)}
      onDrop={(e) => onDrop(e, column.id, 'column')}
      onDragOver={onDragOver}
      className="w-80 shrink-0 bg-gray-100 max-h-full flex flex-col rounded-lg border border-gray-200"
    >
      {/* Column Header */}
      <div className="p-3 flex justify-between items-center font-medium text-sm text-gray-700 cursor-grab active:cursor-grabbing">
        {isEditingTitle ? (
          <Input
            autoFocus
            value={titleEditValue}
            onChange={(e) => setTitleEditValue(e.target.value)}
            onBlur={handleTitleUpdate}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleUpdate()}
            className="h-7 text-sm"
          />
        ) : (
          <div
            className="flex-1 truncate mr-2"
            onClick={() => setIsEditingTitle(true)}
          >
            {column.title}
            <span className="ml-2 text-xs text-gray-400 font-normal">
              {tasks.length}
            </span>
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>
              <Edit2 className="w-4 h-4 mr-2" /> Renomear
            </DropdownMenuItem>
            {/* Delete functionality could be added here */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tasks Area */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[100px]">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDragStart={onDragStart}
            onClick={() => onTaskClick(task.id)}
          />
        ))}
      </div>

      {/* Add Task Footer */}
      <div className="p-2">
        {isAddingTask ? (
          <div className="bg-white p-2 rounded shadow-sm border">
            <form onSubmit={handleAddTask}>
              <Input
                autoFocus
                placeholder="Título da tarefa"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="mb-2 h-8 text-sm"
              />
              <div className="flex gap-2">
                <Button type="submit" size="sm" className="h-7 text-xs">
                  Adicionar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setIsAddingTask(false)}
                >
                  X
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-500 hover:text-gray-800 hover:bg-gray-200/50"
            onClick={() => setIsAddingTask(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar cartão
          </Button>
        )}
      </div>
    </div>
  )
}
