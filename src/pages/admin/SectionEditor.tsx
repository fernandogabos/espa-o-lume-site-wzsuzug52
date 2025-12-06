import { useParams, useNavigate } from 'react-router-dom'
import { useCMS } from '@/contexts/CMSContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { ImagePicker } from '@/components/admin/ImagePicker'
import { IconPicker } from '@/components/admin/IconPicker'
import { useForm, useFieldArray } from 'react-hook-form'
import { useEffect } from 'react'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { TestimonialsEditor } from '@/components/admin/editors/TestimonialsEditor'
import { CompaniesEditor } from '@/components/admin/editors/CompaniesEditor'

export default function SectionEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, updateSection, saveChanges } = useCMS()
  const { toast } = useToast()

  const section = data.sections.find((s) => s.id === id)

  const { register, control, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: section?.content || {},
  })

  useEffect(() => {
    if (section) {
      reset(section.content)
    }
  }, [section, reset])

  if (!section) return <div>Seção não encontrada</div>

  const onSubmit = (formData: any) => {
    updateSection(section.id, formData)
    saveChanges()
    toast({ title: 'Seção atualizada com sucesso!' })
  }

  // Dynamic Fields based on Section Type
  const renderFields = () => {
    switch (section.type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título Principal</Label>
              <Input {...register('title')} />
            </div>
            <div className="space-y-2">
              <Label>Subtítulo</Label>
              <Textarea {...register('subtitle')} />
            </div>
            <div className="space-y-2">
              <Label>Texto do Botão</Label>
              <Input {...register('buttonText')} />
            </div>
            <div className="space-y-2">
              <ImagePicker
                label="Imagem de Fundo"
                value={watch('backgroundImage')}
                onChange={(url) => setValue('backgroundImage', url)}
              />
            </div>
          </div>
        )

      case 'about':
      case 'contact':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input {...register('title')} />
            </div>
            {section.type === 'contact' && (
              <div className="space-y-2">
                <Label>Texto Introdutório</Label>
                <Input {...register('intro')} />
              </div>
            )}
            <div className="space-y-2">
              <Label>Texto Principal</Label>
              <Textarea className="min-h-[150px]" {...register('text')} />
            </div>
            {section.type === 'about' && (
              <>
                <div className="space-y-2">
                  <Label>Destaque (Citação)</Label>
                  <Textarea {...register('highlight')} />
                </div>
                <div className="space-y-2">
                  <Label>Texto de Fechamento</Label>
                  <Textarea {...register('closing')} />
                </div>
              </>
            )}
          </div>
        )

      case 'features':
      case 'structure':
      case 'benefits':
      case 'location':
        return (
          <ItemsEditor
            control={control}
            register={register}
            setValue={setValue}
            watch={watch}
            type={section.type}
          />
        )

      case 'rooms':
        return (
          <RoomsEditor
            control={control}
            register={register}
            setValue={setValue}
            watch={watch}
          />
        )

      case 'gallery':
        return (
          <GalleryEditor
            control={control}
            register={register}
            setValue={setValue}
            watch={watch}
          />
        )

      case 'testimonials':
        return (
          <TestimonialsEditor
            control={control}
            register={register}
            setValue={setValue}
            watch={watch}
          />
        )

      case 'companies':
        return (
          <CompaniesEditor
            control={control}
            register={register}
            setValue={setValue}
            watch={watch}
          />
        )

      default:
        return <div>Editor não implementado para este tipo de seção.</div>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/admin/sections')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-lume-deep-blue">
            Editar: {section.title}
          </h2>
          <p className="text-muted-foreground">Tipo: {section.type}</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {renderFields()}
            <div className="flex justify-end pt-4 border-t">
              <Button
                type="submit"
                size="lg"
                className="bg-lume-deep-blue hover:bg-lume-deep-blue/90"
              >
                Salvar Alterações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// Sub-editors for lists
function ItemsEditor({ control, register, setValue, watch, type }: any) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-lg">Itens da Lista</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({ title: 'Novo Item', description: '', icon: 'Check' })
          }
        >
          <Plus className="w-4 h-4 mr-2" /> Adicionar Item
        </Button>
      </div>

      <div className="grid gap-4">
        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-sm text-gray-500">
                  Item {index + 1}
                </h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-red-500"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input {...register(`items.${index}.title`)} />
                </div>
                <div className="space-y-2">
                  <IconPicker
                    value={watch(`items.${index}.icon`)}
                    onChange={(val) => setValue(`items.${index}.icon`, val)}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Descrição</Label>
                  <Textarea {...register(`items.${index}.description`)} />
                </div>
                {type === 'structure' && (
                  <div className="col-span-2 space-y-2">
                    <ImagePicker
                      label="Imagem"
                      value={watch(`items.${index}.image`)}
                      onChange={(url) => setValue(`items.${index}.image`, url)}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function RoomsEditor({ control, register, setValue, watch }: any) {
  const { fields, append, remove } = useFieldArray({
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
        <Label>Subtítulo</Label>
        <Input {...register('subtitle')} />
      </div>

      <div className="flex justify-between items-center mt-8">
        <Label className="text-lg">Salas</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({ title: 'Nova Sala', price: '', area: '', features: [] })
          }
        >
          <Plus className="w-4 h-4 mr-2" /> Adicionar Sala
        </Button>
      </div>

      <div className="grid gap-6">
        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-sm text-gray-500">
                  Sala {index + 1}
                </h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-red-500"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome da Sala</Label>
                  <Input {...register(`items.${index}.title`)} />
                </div>
                <div className="space-y-2">
                  <Label>Preço</Label>
                  <Input {...register(`items.${index}.price`)} />
                </div>
                <div className="space-y-2">
                  <Label>Área</Label>
                  <Input {...register(`items.${index}.area`)} />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Descrição</Label>
                  <Textarea {...register(`items.${index}.description`)} />
                </div>
                <div className="col-span-2 space-y-2">
                  <ImagePicker
                    label="Foto da Sala"
                    value={watch(`items.${index}.image`)}
                    onChange={(url) => setValue(`items.${index}.image`, url)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function GalleryEditor({ control, setValue, watch, register }: any) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'images',
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-lg">Fotos da Galeria</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ src: '', alt: '' })}
        >
          <Plus className="w-4 h-4 mr-2" /> Adicionar Foto
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-red-500 h-6 w-6"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <ImagePicker
                label={`Foto ${index + 1}`}
                value={watch(`images.${index}.src`)}
                onChange={(url) => setValue(`images.${index}.src`, url)}
              />
              <div className="space-y-2">
                <Label>Descrição (Alt Text)</Label>
                <Input {...register(`images.${index}.alt`)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
