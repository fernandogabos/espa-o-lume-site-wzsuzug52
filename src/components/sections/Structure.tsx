import {
  Coffee,
  Wind,
  Hammer,
  Calendar,
  Camera,
  ShieldAlert,
  FileCheck,
  Accessibility,
  Palette,
} from 'lucide-react'
import { useInView } from '@/hooks/use-in-view'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

const structureItems = [
  {
    icon: Coffee,
    title: 'Área de espera',
    description: 'Com café e água para seus clientes.',
    image:
      'https://img.usecurling.com/p/400/300?q=waiting%20room%20coffee&dpr=2',
  },
  {
    icon: Wind,
    title: 'Ambientes climatizados',
    description: 'Conforto térmico em todas as salas.',
    image:
      'https://img.usecurling.com/p/400/300?q=air%20conditioner%20room&dpr=2',
  },
  {
    icon: Hammer,
    title: 'Salas recém reformadas',
    description: 'Acabamento moderno e impecável.',
    image:
      'https://img.usecurling.com/p/400/300?q=modern%20office%20renovated&dpr=2',
  },
  {
    icon: Calendar,
    title: 'Sistema de agendamento',
    description: 'Gestão própria e facilitada.',
    image:
      'https://img.usecurling.com/p/400/300?q=calendar%20app%20mockup&dpr=2',
  },
  {
    icon: Camera,
    title: 'Monitoramento 24h',
    description: 'Câmeras para sua segurança.',
    image:
      'https://img.usecurling.com/p/400/300?q=security%20camera%20office&dpr=2',
  },
  {
    icon: ShieldAlert,
    title: 'Alarme e cerca elétrica',
    description: 'Proteção patrimonial completa.',
    image: 'https://img.usecurling.com/p/400/300?q=security%20system&dpr=2',
  },
  {
    icon: FileCheck,
    title: 'Documentação completa',
    description: 'AVCB e vigilância sanitária em dia.',
    image: 'https://img.usecurling.com/p/400/300?q=document%20approved&dpr=2',
  },
  {
    icon: Accessibility,
    title: 'Acessibilidade',
    description: 'Banheiros adaptados para PNE.',
    image: 'https://img.usecurling.com/p/400/300?q=accessible%20bathroom&dpr=2',
  },
  {
    icon: Palette,
    title: 'Personalização',
    description: 'Possibilidade de personalizar sua sala.',
    image:
      'https://img.usecurling.com/p/400/300?q=interior%20design%20office&dpr=2',
  },
]

export function Structure() {
  const { ref, hasTriggered } = useInView({ threshold: 0.1 })

  return (
    <section id="structure" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-display font-bold text-3xl md:text-4xl text-lume-deep-blue mb-12 text-center">
          Nossa Estrutura
        </h2>

        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {structureItems.map((item, index) => (
            <Card
              key={item.title}
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
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-display font-bold text-lg">
                    {item.title}
                  </h3>
                </div>
              </div>
              <CardContent className="p-6 bg-lume-cream/20">
                <p className="text-lume-deep-blue/80">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
