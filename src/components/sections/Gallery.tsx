import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useInView } from '@/hooks/use-in-view'
import { cn } from '@/lib/utils'
import { ZoomIn } from 'lucide-react'
import { GallerySection } from '@/types/content'

export function Gallery({ content }: { content: GallerySection['content'] }) {
  const { ref, hasTriggered } = useInView({ threshold: 0.1 })
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-display font-bold text-3xl md:text-4xl text-lume-deep-blue mb-12 text-center">
          {content.title}
        </h2>

        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {content.images.map((photo, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <div
                  className={cn(
                    'relative group cursor-pointer overflow-hidden rounded-xl aspect-[4/3]',
                    hasTriggered
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-95',
                  )}
                  style={{ transition: `all 0.5s ease-out ${index * 100}ms` }}
                  onClick={() => setSelectedPhoto(photo.src)}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-10 h-10" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white font-medium">{photo.alt}</p>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-none shadow-none">
                <DialogTitle className="sr-only">{photo.alt}</DialogTitle>
                <DialogDescription className="sr-only">
                  Visualização ampliada da foto {photo.alt}
                </DialogDescription>
                <div className="relative w-full h-auto rounded-lg overflow-hidden">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                  />
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  )
}
