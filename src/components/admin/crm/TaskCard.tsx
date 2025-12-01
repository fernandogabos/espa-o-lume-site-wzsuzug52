import { Task } from '@/types/crm'
import { cn } from '@/lib/utils'
import { AlignLeft, CheckSquare, MessageSquare, Paperclip } from 'lucide-react'

interface TaskCardProps {
  task: Task
  onDragStart: (
    e: React.DragEvent,
    type: 'column' | 'task',
    id: string,
    fromId?: string,
  ) => void
  onClick: () => void
}

export function TaskCard({ task, onDragStart, onClick }: TaskCardProps) {
  const completedChecklist = task.checklist.filter((i) => i.completed).length
  const hasDescription = !!task.description
  const hasComments = task.comments.length > 0
  const hasChecklist = task.checklist.length > 0
  const hasAttachments = task.attachments.length > 0

  const priorityColors = {
    low: 'bg-green-100 text-green-700 border-green-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    high: 'bg-red-100 text-red-700 border-red-200',
  }

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, 'task', task.id, task.columnId)}
      onClick={onClick}
      className="bg-white p-3 rounded shadow-sm border border-gray-200 hover:border-lume-mint cursor-pointer group select-none active:shadow-lg active:rotate-1 transition-all"
    >
      {/* Labels */}
      <div className="flex flex-wrap gap-1 mb-2">
        {task.priority && (
          <span
            className={cn(
              'text-[10px] px-1.5 py-0.5 rounded border uppercase font-semibold tracking-wider',
              priorityColors[task.priority],
            )}
          >
            {task.priority === 'low'
              ? 'Baixa'
              : task.priority === 'medium'
                ? 'Média'
                : 'Alta'}
          </span>
        )}
        {task.labels.map((color) => (
          <div
            key={color}
            className="h-2 w-8 rounded-full"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <h4 className="text-sm font-medium text-gray-800 mb-2 leading-tight">
        {task.title}
      </h4>

      {/* Indicators */}
      <div className="flex gap-3 text-gray-400">
        {hasDescription && <AlignLeft className="w-3 h-3" />}
        {hasComments && (
          <div className="flex items-center gap-0.5 text-xs">
            <MessageSquare className="w-3 h-3" />
            <span>{task.comments.length}</span>
          </div>
        )}
        {hasChecklist && (
          <div
            className={cn(
              'flex items-center gap-0.5 text-xs',
              completedChecklist === task.checklist.length
                ? 'text-green-600'
                : '',
            )}
          >
            <CheckSquare className="w-3 h-3" />
            <span>
              {completedChecklist}/{task.checklist.length}
            </span>
          </div>
        )}
        {hasAttachments && (
          <div className="flex items-center gap-0.5 text-xs">
            <Paperclip className="w-3 h-3" />
            <span>{task.attachments.length}</span>
          </div>
        )}
      </div>
    </div>
  )
}
