import {
  Wifi,
  CalendarCheck,
  Users,
  Key,
  Shield,
  MapPin,
  Heart,
  Zap,
  Droplets,
} from 'lucide-react'
import { useInView } from '@/hooks/use-in-view'
import { cn } from '@/lib/utils'

const benefits = [
  {
    icon: Wifi,
    title: 'Internet',
    description: 'Conexão de alta velocidade inclusa.',
  },
  {
    icon: Droplets,
    title: 'Água e Luz',
    description: 'Despesas básicas já inclusas no valor.',
  },
  {
    icon: CalendarCheck,
    title: 'Sistema de Agendamento',
    description: 'Exclusivo para gerenciar seus horários.',
  },
  {
    icon: Users,
    title: 'Ambiente Multidisciplinar',
    description: 'Networking com diversos profissionais.',
  },
  {
    icon: Key,
    title: 'Sublocação',
    description: 'Possibilidade mediante alinhamento.',
  },
  {
    icon: Shield,
    title: 'Segurança Completa',
    description: 'Monitoramento, alarme e cerca elétrica.',
  },
  {
    icon: MapPin,
    title: 'Localização Estratégica',
    description: 'Fácil acesso na Vila Arens.',
  },
  {
    icon: Heart,
    title: 'Ambiente Acolhedor',
    description: 'Pensado para o bem-estar de todos.',
  },
]

export function Benefits() {
  const { ref, hasTriggered } = useInView({ threshold: 0.1 })

  return (
    <section id="benefits" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-display font-bold text-3xl md:text-4xl text-lume-deep-blue mb-12 text-center">
          Benefícios Exclusivos
        </h2>

        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className={cn(
                'p-6 rounded-2xl bg-lume-cream/30 border border-lume-gray hover:border-lume-mint/50 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 group',
                hasTriggered
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8',
              )}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 group-hover:bg-lume-mint transition-colors duration-300">
                <benefit.icon className="w-6 h-6 text-lume-mint group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-display font-bold text-lg text-lume-deep-blue mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-lume-deep-blue/70 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
