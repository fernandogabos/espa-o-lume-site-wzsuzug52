import React, { createContext, useContext, useState, useEffect } from 'react'
import { CMSData, Section, SiteConfig } from '@/types/content'
import { initialContent } from '@/lib/initial-content'

interface CMSContextType {
  data: CMSData
  updateConfig: (newConfig: Partial<SiteConfig>) => void
  updateSection: (sectionId: string, newContent: any) => void
  toggleSectionVisibility: (sectionId: string) => void
  reorderSections: (startIndex: number, endIndex: number) => void
  isAuthenticated: boolean
  login: (password: string) => boolean
  logout: () => void
  saveChanges: () => void
}

const CMSContext = createContext<CMSContextType | undefined>(undefined)

export function CMSProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<CMSData>(initialContent)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('lume_cms_data')
    if (savedData) {
      try {
        setData(JSON.parse(savedData))
      } catch (e) {
        console.error('Failed to parse saved CMS data', e)
      }
    }

    const auth = localStorage.getItem('lume_cms_auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  // Update CSS variables when colors change
  useEffect(() => {
    const root = document.documentElement
    const { colors } = data.config
    root.style.setProperty('--lume-mint', colors.mint)
    root.style.setProperty('--lume-sky', colors.sky)
    root.style.setProperty('--lume-gray', colors.gray)
    root.style.setProperty('--lume-cream', colors.cream)
    root.style.setProperty('--lume-deep-blue', colors.deepBlue)
    root.style.setProperty('--lume-yellow', colors.yellow)

    // Update SEO
    document.title = data.config.title
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute('content', data.config.description)
    }
  }, [data.config])

  const saveChanges = () => {
    localStorage.setItem('lume_cms_data', JSON.stringify(data))
  }

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

  const login = (password: string) => {
    // Mock authentication - in real app use Firebase Auth
    if (password === 'admin123') {
      setIsAuthenticated(true)
      localStorage.setItem('lume_cms_auth', 'true')
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('lume_cms_auth')
  }

  // Auto-save on changes (debounced in a real app, but here direct)
  useEffect(() => {
    saveChanges()
  }, [data])

  return (
    <CMSContext.Provider
      value={{
        data,
        updateConfig,
        updateSection,
        toggleSectionVisibility,
        reorderSections,
        isAuthenticated,
        login,
        logout,
        saveChanges,
      }}
    >
      {children}
    </CMSContext.Provider>
  )
}

export function useCMS() {
  const context = useContext(CMSContext)
  if (context === undefined) {
    throw new Error('useCMS must be used within a CMSProvider')
  }
  return context
}
