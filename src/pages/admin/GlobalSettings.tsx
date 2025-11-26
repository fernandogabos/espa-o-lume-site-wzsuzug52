import { useCMS } from '@/contexts/CMSContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { ImagePicker } from '@/components/admin/ImagePicker'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'

export default function GlobalSettings() {
  const { data, updateConfig, saveChanges } = useCMS()
  const { toast } = useToast()
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: data.config,
  })

  useEffect(() => {
    Object.keys(data.config).forEach((key) => {
      setValue(key as any, (data.config as any)[key])
    })
  }, [data.config, setValue])

  const onSubmit = (formData: any) => {
    updateConfig(formData)
    saveChanges()
    toast({ title: 'Configurações salvas com sucesso!' })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-lume-deep-blue">
          Configurações Globais
        </h2>
        <p className="text-muted-foreground">
          Gerencie SEO, informações de contato e identidade visual.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">Geral & SEO</TabsTrigger>
            <TabsTrigger value="contact">Contato</TabsTrigger>
            <TabsTrigger value="visual">Identidade Visual</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Site (SEO)</CardTitle>
                <CardDescription>
                  Como o site aparece no Google e redes sociais.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Site</Label>
                  <Input id="title" {...register('title')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Meta Descrição</Label>
                  <Textarea id="description" {...register('description')} />
                </div>
                <div className="space-y-2">
                  <ImagePicker
                    label="Logo do Site"
                    value={watch('logo') || ''}
                    onChange={(url) => setValue('logo', url)}
                  />
                </div>
                <div className="space-y-2">
                  <ImagePicker
                    label="Imagem de Compartilhamento (OG Image)"
                    value={watch('ogImage')}
                    onChange={(url) => setValue('ogImage', url)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
                <CardDescription>
                  Exibidas no rodapé e seção de contato.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" {...register('contact.phone')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp (apenas números)</Label>
                    <Input id="whatsapp" {...register('contact.whatsapp')} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" {...register('contact.email')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço Completo</Label>
                  <Input id="address" {...register('contact.address')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Link do Instagram</Label>
                  <Input id="instagram" {...register('contact.instagram')} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hours_week">Horário (Seg-Sex)</Label>
                    <Input
                      id="hours_week"
                      {...register('contact.hours.weekdays')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hours_sat">Horário (Sáb)</Label>
                    <Input
                      id="hours_sat"
                      {...register('contact.hours.saturday')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visual">
            <Card>
              <CardHeader>
                <CardTitle>Cores do Tema</CardTitle>
                <CardDescription>
                  Personalize a paleta de cores do site.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Cor Primária (Mint)</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        className="w-12 h-10 p-1"
                        {...register('colors.mint')}
                      />
                      <Input {...register('colors.mint')} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Cor Secundária (Sky)</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        className="w-12 h-10 p-1"
                        {...register('colors.sky')}
                      />
                      <Input {...register('colors.sky')} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Azul Profundo (Texto/Logo)</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        className="w-12 h-10 p-1"
                        {...register('colors.deepBlue')}
                      />
                      <Input {...register('colors.deepBlue')} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Amarelo (Detalhes)</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        className="w-12 h-10 p-1"
                        {...register('colors.yellow')}
                      />
                      <Input {...register('colors.yellow')} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Creme (Fundo)</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        className="w-12 h-10 p-1"
                        {...register('colors.cream')}
                      />
                      <Input {...register('colors.cream')} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            size="lg"
            className="bg-lume-deep-blue hover:bg-lume-deep-blue/90"
          >
            Salvar Alterações
          </Button>
        </div>
      </form>
    </div>
  )
}
