import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { CMSProvider } from '@/contexts/CMSContext'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'

// Admin Pages
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import SectionList from './pages/admin/SectionList'
import SectionEditor from './pages/admin/SectionEditor'
import GlobalSettings from './pages/admin/GlobalSettings'
import { AdminLayout } from './components/admin/AdminLayout'

// CRM Pages
import CRMBoardList from './pages/admin/crm/CRMBoardList'
import CRMBoard from './pages/admin/crm/CRMBoard'

const App = () => (
  <CMSProvider>
    <BrowserRouter
      future={{ v7_startTransition: false, v7_relativeSplatPath: false }}
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          {/* Public Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="sections" element={<SectionList />} />
            <Route path="sections/:id" element={<SectionEditor />} />
            <Route path="settings" element={<GlobalSettings />} />

            {/* CRM Routes */}
            <Route path="crm" element={<CRMBoardList />} />
            <Route path="crm/board/:boardId" element={<CRMBoard />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </CMSProvider>
)

export default App
