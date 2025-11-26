import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Image as ImageIcon, Upload, Link as LinkIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ImagePickerProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export function ImagePicker({
  value,
  onChange,
  label = 'Imagem',
}: ImagePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [urlInput, setUrlInput] = useState(value)

  const handleSave = () => {
    onChange(urlInput)
    setIsOpen(false)
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-4 items-start">
        <div className="relative w-32 h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
          {value ? (
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <ImageIcon className="w-8 h-8" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Upload className="w-4 h-4 mr-2" />
                Alterar Imagem
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Selecionar Imagem</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="url">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="url">Link Direto</TabsTrigger>
                  <TabsTrigger value="upload">Upload (Simulado)</TabsTrigger>
                </TabsList>
                <TabsContent value="url" className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>URL da Imagem</Label>
                    <div className="flex gap-2">
                      <LinkIcon className="w-4 h-4 mt-3 text-gray-500" />
                      <Input
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <Button onClick={handleSave} className="w-full">
                    Confirmar
                  </Button>
                </TabsContent>
                <TabsContent
                  value="upload"
                  className="py-4 text-center space-y-4"
                >
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 hover:bg-gray-50 transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      Clique para selecionar um arquivo
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      (Simulação: Irá gerar uma URL aleatória)
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      const randomId = Math.floor(Math.random() * 1000)
                      setUrlInput(
                        `https://img.usecurling.com/p/800/600?q=office&seed=${randomId}`,
                      )
                      handleSave()
                    }}
                    className="w-full"
                  >
                    Simular Upload
                  </Button>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
          <p className="text-xs text-gray-500 mt-2">
            Recomendado: Imagens em formato JPG ou PNG, máximo 2MB.
          </p>
        </div>
      </div>
    </div>
  )
}
