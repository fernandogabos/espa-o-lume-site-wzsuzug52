import * as Icons from 'lucide-react'
import { useInView } from '@/hooks/use-in-view'
import { cn } from '@/lib/utils'
import { LocationSection } from '@/types/content'

export function Location({ content }: { content: LocationSection['content'] }) {
  const { ref, hasTriggered } = useInView({ threshold: 0.2 })

  return (
    <section id="location" className="py-20 bg-lume-gray/20">
      <div className="container mx-auto px-4">
        <h2 className="font-display font-bold text-3xl md:text-4xl text-lume-deep-blue mb-12 text-center">
          {content.title}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div
            ref={ref}
            className={cn(
              'space-y-8 transition-all duration-1000',
              hasTriggered
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-10',
            )}
          >
            <div className="prose prose-lg text-lume-deep-blue/80">
              <p className="whitespace-pre-line">{content.text}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {content.highlights.map((highlight, index) => {
                const Icon = (Icons as any)[highlight.icon] || Icons.HelpCircle
                return (
                  <div key={index} className="flex items-start gap-3">
                    <Icon className="w-6 h-6 text-lume-mint mt-1" />
                    <div>
                      <h4 className="font-bold text-lume-deep-blue">
                        {highlight.title}
                      </h4>
                      <p className="text-sm text-lume-deep-blue/70">
                        {highlight.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Map */}
          <div
            className={cn(
              'h-[400px] rounded-2xl overflow-hidden shadow-lg border-4 border-white transition-all duration-1000 delay-300',
              hasTriggered
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-10',
            )}
          >
            <iframe
              src={content.mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de Localização Espaço Lume"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  )
}
