import { useCMS } from '@/contexts/CMSContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Layers, Eye, MousePointerClick, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { data } = useCMS()
  const activeSections = data.sections.filter((s) => s.isVisible).length

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-lume-deep-blue">
          Dashboard
        </h2>
        <p className="text-muted-foreground">
          Bem-vindo ao painel de controle do Espaço Lume.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seções Ativas</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeSections} / {data.sections.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Seções visíveis no site
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Salas
            </CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(data.sections.find((s) => s.type === 'rooms') as any)?.content
                .items.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Salas cadastradas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Link
              to="/admin/sections"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-lume-mint/10 transition-colors border border-gray-100"
            >
              <div className="bg-white p-2 rounded-md shadow-sm mr-4">
                <Layers className="h-6 w-6 text-lume-deep-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-lume-deep-blue">
                  Gerenciar Conteúdo
                </h3>
                <p className="text-sm text-gray-500">
                  Editar textos e imagens das seções
                </p>
              </div>
            </Link>
            <Link
              to="/admin/settings"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-lume-mint/10 transition-colors border border-gray-100"
            >
              <div className="bg-white p-2 rounded-md shadow-sm mr-4">
                <Settings className="h-6 w-6 text-lume-deep-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-lume-deep-blue">
                  Configurações
                </h3>
                <p className="text-sm text-gray-500">SEO, Cores e Contato</p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
