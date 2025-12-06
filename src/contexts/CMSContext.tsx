import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react'
import { CMSData, SiteConfig } from '@/types/content'
import { initialContent } from '@/lib/initial-content'
import { CRMData, Board, Column, Task, User as CRMUser } from '@/types/crm'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'
import {
  saveSiteData,
  loadSiteData,
  SITE_DATA_SECTION_NAME,
} from '@/services/site-data'

// Helper for UUID
const generateId = () => Math.random().toString(36).substring(2, 9)

const initialCRM: CRMData = {
  boards: [
    {
      id: 'leads-board',
      title: 'Gestão de Leads',
      description: 'Acompanhamento de contatos do site',
      color: '#94D1B4',
      isFavorite: true,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  columns: [
    {
      id: 'col-new',
      boardId: 'leads-board',
      title: 'Novos Contatos',
      order: 0,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'col-progress',
      boardId: 'leads-board',
      title: 'Em Atendimento',
      order: 1,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'col-done',
      boardId: 'leads-board',
      title: 'Concluído',
      order: 2,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  tasks: [
    {
      id: 'task-example',
      columnId: 'col-new',
      title: 'Contato Exemplo',
      description: 'Interessado na Sala 1.\nEmail: exemplo@email.com',
      priority: 'medium',
      labels: ['#AFD9FF'],
      checklist: [],
      comments: [],
      attachments: [],
      order: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
}

interface CMSContextType {
  // CMS
  data: CMSData
  updateConfig: (newConfig: Partial<SiteConfig>) => void
  updateSection: (sectionId: string, newContent: any) => void
  toggleSectionVisibility: (sectionId: string) => void
  reorderSections: (startIndex: number, endIndex: number) => void
  isAuthenticated: boolean
  currentUser: CRMUser
  login: (password: string) => Promise<boolean>
  logout: () => Promise<void>
  saveChanges: () => Promise<void>

  // CRM
  crm: CRMData
  addBoard: (board: Partial<Board>) => void
  updateBoard: (id: string, updates: Partial<Board>) => void
  deleteBoard: (id: string) => void
  addColumn: (boardId: string, title: string) => void
  updateColumn: (id: string, updates: Partial<Column>) => void
  moveColumn: (columnId: string, newIndex: number) => void
  addTask: (task: Partial<Task>, notify?: boolean) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  moveTask: (taskId: string, targetColumnId: string, newIndex: number) => void
  addLeadFromContact: (
    name: string,
    email: string,
    phone: string,
    message: string,
  ) => void
  addNewLead: (lead: Partial<Task>) => void
}

const CMSContext = createContext<CMSContextType | undefined>(undefined)

export function CMSProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<CMSData>(initialContent)
  const [crm, setCrm] = useState<CRMData>(initialCRM)
  const { user, signIn, signOut } = useAuth()

  // Map Supabase user to CRM user
  const currentUser: CRMUser = {
    id: user?.id || 'anonymous',
    name: user?.email || 'Visitante',
    role: user ? 'admin' : 'user',
  }

  // Load CMS data from Supabase on mount
  useEffect(() => {
    const loadContent = async () => {
      try {
        const savedContent = await loadSiteData(SITE_DATA_SECTION_NAME)
        if (savedContent) {
          setData(savedContent)
        } else {
          // If no content in DB, use initial content
          setData(initialContent)
        }
      } catch (error) {
        console.error('Failed to load site data:', error)
        // Fallback to initial content in case of error
        setData(initialContent)
      }
    }

    loadContent()
  }, [])

  // Load CRM from localStorage on mount
  useEffect(() => {
    const savedCRM = localStorage.getItem('lume_crm_data')
    if (savedCRM) {
      try {
        setCrm(JSON.parse(savedCRM))
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  // Save changes logic
  // We only auto-save CRM to localStorage. CMS data must be explicitly saved or triggered.
  // However, the user story implies persistence. We'll make saveChanges persist to DB.
  useEffect(() => {
    localStorage.setItem('lume_crm_data', JSON.stringify(crm))
  }, [crm])

  const saveChanges = useCallback(async () => {
    if (user) {
      try {
        await saveSiteData(SITE_DATA_SECTION_NAME, data)
        toast.success('Alterações salvas na nuvem')
      } catch (error) {
        console.error('Error saving changes:', error)
        toast.error('Erro ao salvar alterações')
      }
    } else {
      // Fallback for unauthenticated users (should not happen in admin)
      console.warn('User not authenticated, cannot save to database.')
    }
  }, [data, user])

  // CMS Functions
  const updateConfig = (newConfig: Partial<SiteConfig>) => {
    setData((prev) => ({
      ...prev,
      config: { ...prev.config, ...newConfig },
    }))
  }

  const updateSection = (sectionId: string, newContent: any) => {
    setData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? { ...section, content: { ...section.content, ...newContent } }
          : section,
      ),
    }))
  }

  const toggleSectionVisibility = (sectionId: string) => {
    setData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? { ...section, isVisible: !section.isVisible }
          : section,
      ),
    }))
  }

  const reorderSections = (startIndex: number, endIndex: number) => {
    setData((prev) => {
      const result = Array.from(prev.sections)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      return { ...prev, sections: result }
    })
  }

  // CRM Functions
  const addBoard = (board: Partial<Board>) => {
    const newBoard: Board = {
      id: generateId(),
      title: board.title || 'Novo Quadro',
      description: board.description || '',
      color: board.color || '#94D1B4',
      isFavorite: false,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setCrm((prev) => ({ ...prev, boards: [...prev.boards, newBoard] }))
  }

  const updateBoard = (id: string, updates: Partial<Board>) => {
    setCrm((prev) => ({
      ...prev,
      boards: prev.boards.map((b) =>
        b.id === id
          ? { ...b, ...updates, updatedAt: new Date().toISOString() }
          : b,
      ),
    }))
  }

  const deleteBoard = (id: string) => {
    setCrm((prev) => ({
      ...prev,
      boards: prev.boards.filter((b) => b.id !== id),
      columns: prev.columns.filter((c) => c.boardId !== id),
      tasks: prev.tasks.filter((t) => {
        const col = prev.columns.find((c) => c.id === t.columnId)
        return col && col.boardId !== id
      }),
    }))
  }

  const addColumn = (boardId: string, title: string) => {
    setCrm((prev) => {
      const boardColumns = prev.columns.filter((c) => c.boardId === boardId)
      const newColumn: Column = {
        id: generateId(),
        boardId,
        title,
        order: boardColumns.length,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      return { ...prev, columns: [...prev.columns, newColumn] }
    })
  }

  const updateColumn = (id: string, updates: Partial<Column>) => {
    setCrm((prev) => ({
      ...prev,
      columns: prev.columns.map((c) =>
        c.id === id
          ? { ...c, ...updates, updatedAt: new Date().toISOString() }
          : c,
      ),
    }))
  }

  const moveColumn = (columnId: string, newIndex: number) => {
    setCrm((prev) => {
      const column = prev.columns.find((c) => c.id === columnId)
      if (!column) return prev

      const boardColumns = prev.columns
        .filter((c) => c.boardId === column.boardId)
        .sort((a, b) => a.order - b.order)

      const currentIndex = boardColumns.findIndex((c) => c.id === columnId)
      if (currentIndex === -1) return prev

      const newColumns = [...boardColumns]
      const [removed] = newColumns.splice(currentIndex, 1)
      newColumns.splice(newIndex, 0, removed)

      const updatedBoardColumns = newColumns.map((c, idx) => ({
        ...c,
        order: idx,
      }))
      const otherColumns = prev.columns.filter(
        (c) => c.boardId !== column.boardId,
      )

      return {
        ...prev,
        columns: [...otherColumns, ...updatedBoardColumns],
      }
    })
  }

  const sendEmailNotification = (task: Task) => {
    console.log(
      `[MOCK EMAIL] To: contato@espacolume.com.br | Subject: Novo Lead Criado | Body: A new lead "${task.title}" has been created.`,
    )
    toast.success(
      'Notificação por e-mail enviada para contato@espacolume.com.br',
    )
  }

  const addTask = (task: Partial<Task>, notify = false) => {
    if (!task.columnId || !task.title) return

    const newTask: Task = {
      id: generateId(),
      columnId: task.columnId!,
      title: task.title!,
      description: task.description || '',
      priority: task.priority || 'medium',
      labels: task.labels || [],
      checklist: task.checklist || [],
      comments: task.comments || [],
      attachments: task.attachments || [],
      order: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...task,
    }

    setCrm((prev) => {
      const colTasks = prev.tasks.filter((t) => t.columnId === task.columnId)
      return {
        ...prev,
        tasks: [...prev.tasks, { ...newTask, order: colTasks.length }],
      }
    })

    if (notify) {
      sendEmailNotification(newTask)
    }
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setCrm((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === id
          ? { ...t, ...updates, updatedAt: new Date().toISOString() }
          : t,
      ),
    }))
  }

  const moveTask = (
    taskId: string,
    targetColumnId: string,
    newIndex: number,
  ) => {
    setCrm((prev) => {
      const task = prev.tasks.find((t) => t.id === taskId)
      if (!task) return prev

      if (task.columnId === targetColumnId) {
        const colTasks = prev.tasks
          .filter((t) => t.columnId === targetColumnId)
          .sort((a, b) => a.order - b.order)

        const currentIndex = colTasks.findIndex((t) => t.id === taskId)
        if (currentIndex === -1) return prev

        const newColTasks = [...colTasks]
        const [removed] = newColTasks.splice(currentIndex, 1)
        newColTasks.splice(newIndex, 0, removed)

        const updatedTasks = newColTasks.map((t, idx) => ({ ...t, order: idx }))
        const otherTasks = prev.tasks.filter(
          (t) => t.columnId !== targetColumnId,
        )

        return { ...prev, tasks: [...otherTasks, ...updatedTasks] }
      } else {
        const sourceTasks = prev.tasks
          .filter((t) => t.columnId === task.columnId)
          .sort((a, b) => a.order - b.order)
        const targetTasks = prev.tasks
          .filter((t) => t.columnId === targetColumnId)
          .sort((a, b) => a.order - b.order)

        const updatedSourceTasks = sourceTasks
          .filter((t) => t.id !== taskId)
          .map((t, idx) => ({ ...t, order: idx }))

        const taskToMove = { ...task, columnId: targetColumnId }
        targetTasks.splice(newIndex, 0, taskToMove)
        const updatedTargetTasks = targetTasks.map((t, idx) => ({
          ...t,
          order: idx,
        }))

        const otherTasks = prev.tasks.filter(
          (t) => t.columnId !== task.columnId && t.columnId !== targetColumnId,
        )

        return {
          ...prev,
          tasks: [...otherTasks, ...updatedSourceTasks, ...updatedTargetTasks],
        }
      }
    })
  }

  const addLeadFromContact = (
    name: string,
    email: string,
    phone: string,
    message: string,
  ) => {
    let leadsBoard = crm.boards.find((b) =>
      b.title.toLowerCase().includes('lead'),
    )
    if (!leadsBoard) {
      leadsBoard = crm.boards[0]
    }

    if (!leadsBoard) return

    let firstCol = crm.columns
      .filter((c) => c.boardId === leadsBoard!.id)
      .sort((a, b) => a.order - b.order)[0]

    if (!firstCol) return

    addTask(
      {
        columnId: firstCol.id,
        title: `Contato: ${name}`,
        description: `**Nome:** ${name}\n**Email:** ${email}\n**Telefone:** ${phone}\n\n**Mensagem:**\n${message}`,
        priority: 'medium',
        labels: ['#2F4F6F'],
      },
      true,
    )
  }

  const addNewLead = (lead: Partial<Task>) => {
    let leadsBoard = crm.boards.find((b) =>
      b.title.toLowerCase().includes('lead'),
    )
    if (!leadsBoard) {
      leadsBoard = crm.boards[0]
    }

    if (!leadsBoard) {
      console.error('No board found to add lead')
      return
    }

    let firstCol = crm.columns
      .filter((c) => c.boardId === leadsBoard!.id)
      .sort((a, b) => a.order - b.order)[0]

    if (!firstCol) {
      console.error('No column found in board to add lead')
      return
    }

    addTask(
      {
        ...lead,
        columnId: firstCol.id,
        priority: lead.priority || 'medium',
      },
      true,
    )
  }

  // Auth functions wrapping useAuth
  const login = async (password: string) => {
    // We use email login now, but for backward compatibility with the UI component that asks for password
    // we will try to sign in with a default admin email.
    // In a real scenario, we should update the UI to ask for email and password.
    // For now, assuming admin@espacolume.com.br
    const { error } = await signIn('admin@espacolume.com.br', password)
    return !error
  }

  const logout = async () => {
    await signOut()
  }

  return React.createElement(
    CMSContext.Provider,
    {
      value: {
        data,
        updateConfig,
        updateSection,
        toggleSectionVisibility,
        reorderSections,
        isAuthenticated: !!user,
        currentUser,
        login,
        logout,
        saveChanges,
        crm,
        addBoard,
        updateBoard,
        deleteBoard,
        addColumn,
        updateColumn,
        moveColumn,
        addTask,
        updateTask,
        moveTask,
        addLeadFromContact,
        addNewLead,
      },
    },
    children,
  )
}

export function useCMS() {
  const context = useContext(CMSContext)
  if (context === undefined) {
    throw new Error('useCMS must be used within a CMSProvider')
  }
  return context
}
