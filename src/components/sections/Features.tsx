import * as Icons from 'lucide-react'
import { useInView } from '@/hooks/use-in-view'
import { cn } from '@/lib/utils'
import { FeaturesSection } from '@/types/content'

export function Features({ content }: { content: FeaturesSection['content'] }) {
  const { ref, hasTriggered } = useInView({ threshold: 0.1 })

  return (
    <section
      id="features"
      className="py-16 bg-white relative z-20 -mt-8 rounded-t-[2rem]"
    >
      <div className="container mx-auto px-4">
        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          {content.items.map((feature, index) => {
            const Icon = (Icons as any)[feature.icon] || Icons.HelpCircle
            return (
              <div
                key={index}
                className={cn(
                  'bg-lume-cream/50 p-6 rounded-2xl border border-lume-gray hover:shadow-lg transition-all duration-500 hover:-translate-y-1 flex flex-col items-center text-center',
                  hasTriggered
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8',
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-lume-mint/20 rounded-full flex items-center justify-center mb-4 text-lume-deep-blue">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lume-deep-blue mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-lume-deep-blue/70">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
