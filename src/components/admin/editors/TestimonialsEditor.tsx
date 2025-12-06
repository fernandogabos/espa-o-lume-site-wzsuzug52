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
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Título da Seção</Label>
        <Input {...register('title')} />
      </div>

      <div className="flex justify-between items-center mt-8">
        <Label className="text-lg">Depoimentos</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              id: Math.random().toString(36).substr(2, 9),
              name: 'Novo Depoimento',
              role: '',
              content: '',
              rating: 5,
            })
          }
        >
          <Plus className="w-4 h-4 mr-2" /> Adicionar
        </Button>
      </div>

      <div className="grid gap-6">
        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-sm text-gray-500">
                  Depoimento {index + 1}
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
                  <Label>Nome</Label>
                  <Input {...register(`items.${index}.name`)} />
                </div>
                <div className="space-y-2">
                  <Label>Cargo / Profissão</Label>
                  <Input {...register(`items.${index}.role`)} />
                </div>
                <div className="space-y-2">
                  <Label>Avaliação (Estrelas)</Label>
                  <Select
                    value={String(watch(`items.${index}.rating`))}
                    onValueChange={(val) =>
                      setValue(`items.${index}.rating`, Number(val))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <SelectItem key={rating} value={String(rating)}>
                          <div className="flex items-center gap-2">
                            <span>{rating}</span>
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <Label>Conteúdo</Label>
                  <Textarea {...register(`items.${index}.content`)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
