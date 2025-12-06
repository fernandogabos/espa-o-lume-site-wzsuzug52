import { useFieldArray, Control, UseFormRegister } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2, Star } from 'lucide-react'

interface TestimonialsEditorProps {
  control: Control<any>
  register: UseFormRegister<any>
  setValue: (name: string, value: any) => void
  watch: (name: string) => any
}

export function TestimonialsEditor({
  control,
  register,
  setValue,
  watch,
}: TestimonialsEditorProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Título da Seção</Label>
        <Input {...register('title')} placeholder="Ex: O que dizem sobre nós" />
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        <Label className="text-lg font-semibold text-lume-deep-blue">
          Depoimentos
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              id: Math.random().toString(36).substr(2, 9),
              name: 'Novo Cliente',
              role: '',
              content: '',
              rating: 5,
            })
          }
        >
          <Plus className="w-4 h-4 mr-2" /> Adicionar Depoimento
        </Button>
      </div>

      <div className="grid gap-6">
        {fields.map((field, index) => (
          <Card key={field.id} className="bg-gray-50/50">
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wider">
                  Depoimento {index + 1}
                </h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome do Cliente</Label>
                  <Input
                    {...register(`items.${index}.name`)}
                    placeholder="Ex: Maria Silva"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cargo / Profissão (Opcional)</Label>
                  <Input
                    {...register(`items.${index}.role`)}
                    placeholder="Ex: Psicóloga"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Avaliação</Label>
                  <Select
                    value={String(watch(`items.${index}.rating`) || 5)}
                    onValueChange={(val) =>
                      setValue(`items.${index}.rating`, Number(val))
                    }
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Selecione a nota" />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <SelectItem key={rating} value={String(rating)}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{rating}</span>
                            <div className="flex">
                              {Array.from({ length: rating }).map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-3 h-3 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <Label>Conteúdo do Depoimento</Label>
                  <Textarea
                    {...register(`items.${index}.content`)}
                    placeholder="O que o cliente disse..."
                    className="min-h-[100px] bg-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {fields.length === 0 && (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
            Nenhum depoimento adicionado. Clique em "Adicionar Depoimento" para
            começar.
          </div>
        )}
      </div>
    </div>
  )
}
