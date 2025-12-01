export type Priority = 'low' | 'medium' | 'high'

export interface Comment {
  id: string
  text: string
  userId: string
  userName: string
  createdAt: string
}

export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

export interface Attachment {
  id: string
  name: string
  url: string
  type: string
  createdAt: string
}

export interface Task {
  id: string
  columnId: string
  title: string
  description: string
  priority: Priority
  dueDate?: string
  labels: string[]
  checklist: ChecklistItem[]
  comments: Comment[]
  attachments: Attachment[]
  responsibleId?: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface Column {
  id: string
  boardId: string
  title: string
  order: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface Board {
  id: string
  title: string
  description: string
  color: string
  isFavorite: boolean
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export interface CRMData {
  boards: Board[]
  columns: Column[]
  tasks: Task[]
}

export type UserRole = 'admin' | 'manager' | 'user'

export interface User {
  id: string
  name: string
  role: UserRole
  avatar?: string
}
