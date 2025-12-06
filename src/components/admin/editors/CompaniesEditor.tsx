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
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Título da Seção</Label>
        <Input {...register('title')} />
      </div>
      <div className="space-y-2">
        <Label>Descrição</Label>
        <Textarea {...register('description')} />
      </div>

      <div className="flex justify-between items-center mt-8">
        <Label className="text-lg">Empresas e Profissionais</Label>
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
          <Card key={field.id} className="relative group">
            <CardContent className="p-4 space-y-6">
              <div className="flex justify-between items-center bg-gray-50 p-2 rounded -mx-4 -mt-4 mb-4 border-b">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={index === 0}
                    onClick={() => move(index, index - 1)}
                  >
                    <MoveUp className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={index === fields.length - 1}
                    onClick={() => move(index, index + 1)}
                  >
                    <MoveDown className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={watch(`items.${index}.active`)}
                      onCheckedChange={(checked) =>
                        setValue(`items.${index}.active`, checked)
                      }
                    />
                    <Label className="text-sm">
                      {watch(`items.${index}.active`) ? 'Ativo' : 'Inativo'}
                    </Label>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nome</Label>
                    <Input {...register(`items.${index}.name`)} />
                  </div>
                  <div className="space-y-2">
                    <ImagePicker
                      label="Logotipo / Foto"
                      value={watch(`items.${index}.logos.0`)}
                      onChange={(url) =>
                        setValue(`items.${index}.logos`, [url])
                      }
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Contatos</Label>
                  <div className="grid gap-3">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <Input
                        placeholder="Website URL"
                        {...register(`items.${index}.contact.website`)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Instagram className="w-4 h-4 text-gray-500" />
                      <Input
                        placeholder="Instagram URL"
                        {...register(`items.${index}.contact.instagram`)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-gray-500" />
                      <Input
                        placeholder="WhatsApp (Link ou Número)"
                        {...register(`items.${index}.contact.whatsapp`)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <Input
                        placeholder="Email"
                        {...register(`items.${index}.contact.email`)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <Input
                        placeholder="Telefone"
                        {...register(`items.${index}.contact.phone`)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Facebook className="w-4 h-4 text-gray-500" />
                      <Input
                        placeholder="Facebook URL"
                        {...register(`items.${index}.contact.facebook`)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Linkedin className="w-4 h-4 text-gray-500" />
                      <Input
                        placeholder="LinkedIn URL"
                        {...register(`items.${index}.contact.linkedin`)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
