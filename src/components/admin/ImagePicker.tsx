import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Image as ImageIcon, Upload, Link as LinkIcon, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

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
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSave = () => {
    onChange(urlInput)
    setIsOpen(false)
  }

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setUrlInput(e.target.result as string)
          // Automatically save on upload for better UX in the dialog
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-4 items-start">
        <div className="relative w-32 h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 group">
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
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Selecionar Imagem</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                  <TabsTrigger value="url">Link Direto</TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-4 py-4">
                  <div
                    className={cn(
                      'border-2 border-dashed rounded-xl p-8 transition-colors cursor-pointer text-center relative',
                      dragActive
                        ? 'border-lume-mint bg-lume-mint/10'
                        : 'border-gray-200 hover:bg-gray-50',
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileInput}
                    />
                    <Upload
                      className={cn(
                        'w-12 h-12 mx-auto mb-2 transition-colors',
                        dragActive ? 'text-lume-mint' : 'text-gray-400',
                      )}
                    />
                    <p className="text-sm text-gray-600 font-medium">
                      Clique para selecionar ou arraste um arquivo
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Suporta JPG, PNG, WEBP
                    </p>
                  </div>

                  {urlInput && urlInput.startsWith('data:') && (
                    <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border">
                      <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={urlInput}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">
                          Imagem selecionada para upload
                        </p>
                      </div>
                    </div>
                  )}

                  <Button onClick={handleSave} className="w-full">
                    Confirmar Upload
                  </Button>
                </TabsContent>

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
                    Confirmar Link
                  </Button>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
          <p className="text-xs text-gray-500 mt-2">
            Você pode fazer upload de arquivos do seu computador ou colar um
            link externo.
          </p>
        </div>
      </div>
    </div>
  )
}
