import { ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useInView } from '@/hooks/use-in-view'
import { cn } from '@/lib/utils'

export function Hero() {
  const { ref, hasTriggered } = useInView({ threshold: 0.1 })

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://img.usecurling.com/p/1920/1080?q=modern%20office%20reception%20cozy&dpr=2"
          alt="Espaço Lume Interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-lume-deep-blue/40 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-lume-deep-blue/60" />
      </div>

      {/* Content */}
      <div
        ref={ref}
        className={cn(
          'container relative z-10 px-4 text-center text-white transition-all duration-1000 transform mt-16',
          hasTriggered
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10',
        )}
      >
        <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-7xl mb-6 leading-tight text-shadow-sm">
          Conforto, Leveza e Credibilidade
        </h1>
        <p className="font-sans text-lg md:text-xl lg:text-2xl mb-10 max-w-3xl mx-auto text-white/95 font-light leading-relaxed">
          Um ambiente profissional acolhedor na Vila Arens, Jundiaí, projetado
          para inspirar e conectar profissionais.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            onClick={scrollToContact}
            className="bg-lume-mint hover:bg-lume-mint/90 text-white font-semibold text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            Agendar Visita
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <a
          href="#features"
          className="text-white/80 hover:text-white transition-colors"
        >
          <ArrowDown className="w-8 h-8" />
          <span className="sr-only">Rolar para baixo</span>
        </a>
      </div>
    </section>
  )
}
