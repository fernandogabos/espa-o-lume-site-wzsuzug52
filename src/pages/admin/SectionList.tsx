import { useCMS } from '@/contexts/CMSContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import {
  Eye,
  EyeOff,
  GripVertical,
  Pencil,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'

export default function SectionList() {
  const { data, toggleSectionVisibility, reorderSections } = useCMS()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-lume-deep-blue">
          Seções do Site
        </h2>
        <p className="text-muted-foreground">
          Gerencie a ordem e visibilidade das seções da página inicial.
        </p>
      </div>

      <div className="space-y-4">
        {data.sections.map((section, index) => (
          <Card key={section.id} className="transition-all hover:shadow-md">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex flex-col gap-1 text-gray-400">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={index === 0}
                  onClick={() => reorderSections(index, index - 1)}
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={index === data.sections.length - 1}
                  onClick={() => reorderSections(index, index + 1)}
                >
                  <ArrowDown className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg text-lume-deep-blue">
                    {section.title}
                  </h3>
                  <Badge variant="outline" className="text-xs uppercase">
                    {section.type}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">ID: {section.id}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={section.isVisible}
                    onCheckedChange={() => toggleSectionVisibility(section.id)}
                  />
                  <span className="text-sm text-gray-500 w-16">
                    {section.isVisible ? 'Visível' : 'Oculto'}
                  </span>
                </div>

                <Button asChild variant="outline" size="sm">
                  <Link to={`/admin/sections/${section.id}`}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Editar
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
