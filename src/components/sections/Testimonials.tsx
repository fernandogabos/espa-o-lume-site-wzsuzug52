import { Star } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'
import { useInView } from '@/hooks/use-in-view'
import { cn } from '@/lib/utils'
import { TestimonialsSection } from '@/types/content'
import Autoplay from 'embla-carousel-autoplay'

export function Testimonials({
  content,
}: {
  content: TestimonialsSection['content']
}) {
  const { ref, hasTriggered } = useInView({ threshold: 0.1 })

  return (
    <section id="testimonials" className="py-20 bg-lume-cream/30">
      <div className="container mx-auto px-4">
        <h2 className="font-display font-bold text-3xl md:text-4xl text-lume-deep-blue mb-12 text-center">
          {content.title}
        </h2>

        <div
          ref={ref}
          className={cn(
            'transition-all duration-1000',
            hasTriggered
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10',
          )}
        >
          <Carousel
            plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent>
              {content.items.map((testimonial) => (
                <CarouselItem
                  key={testimonial.id}
                  className="md:basis-1/2 lg:basis-1/3 p-4"
                >
                  <Card className="h-full border-none shadow-md bg-white">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex gap-1 mb-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              'w-4 h-4',
                              i < testimonial.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300',
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-lume-deep-blue/80 italic mb-6 flex-grow">
                        "{testimonial.content}"
                      </p>
                      <div>
                        <p className="font-bold text-lume-deep-blue">
                          {testimonial.name}
                        </p>
                        {testimonial.role && (
                          <p className="text-sm text-lume-deep-blue/60">
                            {testimonial.role}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  )
}
