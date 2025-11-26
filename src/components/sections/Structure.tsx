import * as Icons from 'lucide-react'
import { useInView } from '@/hooks/use-in-view'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { StructureSection } from '@/types/content'

export function Structure({
  content,
}: {
  content: StructureSection['content']
}) {
  const { ref, hasTriggered } = useInView({ threshold: 0.1 })

  return (
    <section id="structure" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-display font-bold text-3xl md:text-4xl text-lume-deep-blue mb-12 text-center">
          {content.title}
        </h2>

        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {content.items.map((item, index) => {
            const Icon = (Icons as any)[item.icon] || Icons.HelpCircle
            return (
              <Card
                key={index}
                className={cn(
                  'overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-500 group',
                  hasTriggered
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10',
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                  <div className="absolute bottom-4 left-4 text-white flex items-center gap-2">
                    <div className="bg-lume-mint p-2 rounded-lg">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-display font-bold text-lg">
                      {item.title}
                    </h3>
                  </div>
                </div>
                <CardContent className="p-6 bg-lume-cream/20 h-full">
                  <p className="text-lume-deep-blue/80">{item.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
