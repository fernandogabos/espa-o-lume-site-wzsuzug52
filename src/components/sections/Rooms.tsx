import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useInView } from '@/hooks/use-in-view'
import { cn } from '@/lib/utils'
import { RoomsSection } from '@/types/content'

export function Rooms({ content }: { content: RoomsSection['content'] }) {
  const { ref, hasTriggered } = useInView({ threshold: 0.1 })

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="rooms" className="py-20 bg-lume-sky/10">
      <div className="container mx-auto px-4">
        <h2 className="font-display font-bold text-3xl md:text-4xl text-lume-deep-blue mb-4 text-center">
          {content.title}
        </h2>
        <p className="text-center text-lume-deep-blue/70 mb-12 max-w-2xl mx-auto">
          {content.subtitle}
        </p>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.items.map((room, index) => (
            <Card
              key={index}
              className={cn(
                'flex flex-col border-none shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white',
                hasTriggered
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10',
              )}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="h-48 overflow-hidden rounded-t-xl">
                <img
                  src={room.image}
                  alt={room.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <CardTitle className="text-xl font-bold text-lume-deep-blue">
                    {room.title}
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className="bg-lume-mint/20 text-lume-deep-blue hover:bg-lume-mint/30"
                  >
                    {room.area}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-lume-mint">
                  {room.price}
                  <span className="text-sm text-lume-deep-blue/50 font-normal">
                    /mês
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-lume-deep-blue/80 mb-4 text-sm">
                  {room.description}
                </p>
                <ul className="space-y-2">
                  {room.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center text-sm text-lume-deep-blue/70"
                    >
                      <span className="w-1.5 h-1.5 bg-lume-mint rounded-full mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={scrollToContact}
                  className="w-full bg-lume-deep-blue hover:bg-lume-deep-blue/90 text-white"
                >
                  Agendar Visita ou Solicitar Contato
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
