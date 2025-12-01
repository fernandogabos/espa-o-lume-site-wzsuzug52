import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useCMS } from '@/contexts/CMSContext'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Settings,
  Layers,
  LogOut,
  ExternalLink,
  Kanban,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'

export function AdminLayout() {
  const { isAuthenticated, logout } = useCMS()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login')
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/crm', label: 'CRM & Tarefas', icon: Kanban },
    { href: '/admin/sections', label: 'Seções e Conteúdo', icon: Layers },
    { href: '/admin/settings', label: 'Configurações Globais', icon: Settings },
  ]

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-gray-100">
          <h1 className="font-display font-bold text-xl text-lume-deep-blue">
            Espaço Lume CMS
          </h1>
          <p className="text-xs text-gray-500 mt-1">Painel Administrativo</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                location.pathname === item.href ||
                  (item.href !== '/admin' &&
                    location.pathname.startsWith(item.href))
                  ? 'bg-lume-mint/10 text-lume-deep-blue'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-lume-deep-blue',
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
            Ver Site
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => {
              logout()
              navigate('/admin/login')
            }}
          >
            <LogOut className="w-5 h-5" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
