import { useFieldArray, Control, UseFormRegister } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { ImagePicker } from '@/components/admin/ImagePicker'
import {
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Globe,
  Instagram,
  Facebook,
  Linkedin,
  Phone,
  Mail,
  MessageCircle,
} from 'lucide-react'

interface CompaniesEditorProps {
  control: Control<any>
  register: UseFormRegister<any>
  setValue: (name: string, value: any) => void
  watch: (name: string) => any
}

export function CompaniesEditor({
  control,
  register,
  setValue,
  watch,
}: CompaniesEditorProps) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'items',
  })

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label>Título da Seção</Label>
          <Input
            {...register('title')}
            placeholder="Ex: Parceiros e Profissionais"
          />
        </div>
        <div className="space-y-2">
          <Label>Descrição (Opcional)</Label>
          <Textarea
            {...register('description')}
            placeholder="Breve descrição sobre os parceiros..."
            className="min-h-[80px]"
          />
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        <Label className="text-lg font-semibold text-lume-deep-blue">
          Empresas e Profissionais
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              id: Math.random().toString(36).substr(2, 9),
              name: 'Nova Empresa',
              logos: [],
              contact: {},
              active: true,
            })
          }
        >
          <Plus className="w-4 h-4 mr-2" /> Adicionar
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <Card
            key={field.id}
            className="relative group border-l-4 border-l-lume-mint"
          >
            <CardContent className="p-4 space-y-6">
              <div className="flex justify-between items-center bg-gray-50/80 p-2 rounded -mx-4 -mt-4 mb-4 border-b">
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={index === 0}
                    onClick={() => move(index, index - 1)}
                  >
                    <MoveUp className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={index === fields.length - 1}
                    onClick={() => move(index, index + 1)}
                  >
                    <MoveDown className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border">
                    <Switch
                      checked={watch(`items.${index}.active`)}
                      onCheckedChange={(checked) =>
                        setValue(`items.${index}.active`, checked)
                      }
                    />
                    <Label className="text-xs font-medium cursor-pointer">
                      {watch(`items.${index}.active`) ? 'Visível' : 'Oculto'}
                    </Label>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Nome da Empresa/Profissional</Label>
                    <Input {...register(`items.${index}.name`)} />
                  </div>
                  <div className="space-y-2">
                    <ImagePicker
                      label="Logotipo"
                      value={watch(`items.${index}.logos.0`)}
                      onChange={(url) =>
                        setValue(`items.${index}.logos`, [url])
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Recomendado: Imagem com fundo transparente (PNG).
                    </p>
                  </div>
                </div>

                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  <Label className="text-sm font-semibold text-gray-600">
                    Informações de Contato e Redes Sociais
                  </Label>
                  <div className="grid gap-3">
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                      <Input
                        placeholder="Website URL"
                        className="bg-white h-9"
                        {...register(`items.${index}.contact.website`)}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Instagram className="w-4 h-4 text-gray-400 shrink-0" />
                      <Input
                        placeholder="Instagram URL"
                        className="bg-white h-9"
                        {...register(`items.${index}.contact.instagram`)}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-4 h-4 text-gray-400 shrink-0" />
                      <Input
                        placeholder="WhatsApp (Número ou Link)"
                        className="bg-white h-9"
                        {...register(`items.${index}.contact.whatsapp`)}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                      <Input
                        placeholder="Email"
                        className="bg-white h-9"
                        {...register(`items.${index}.contact.email`)}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                      <Input
                        placeholder="Telefone"
                        className="bg-white h-9"
                        {...register(`items.${index}.contact.phone`)}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Facebook className="w-4 h-4 text-gray-400 shrink-0" />
                      <Input
                        placeholder="Facebook URL"
                        className="bg-white h-9"
                        {...register(`items.${index}.contact.facebook`)}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Linkedin className="w-4 h-4 text-gray-400 shrink-0" />
                      <Input
                        placeholder="LinkedIn URL"
                        className="bg-white h-9"
                        {...register(`items.${index}.contact.linkedin`)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {fields.length === 0 && (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
            Nenhuma empresa cadastrada. Clique em "Adicionar" para começar.
          </div>
        )}
      </div>
    </div>
  )
}
