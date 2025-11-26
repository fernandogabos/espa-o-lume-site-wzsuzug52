import { MapPin, Bus, Building, GraduationCap } from 'lucide-react'
import { useInView } from '@/hooks/use-in-view'
import { cn } from '@/lib/utils'

export function Location() {
  const { ref, hasTriggered } = useInView({ threshold: 0.2 })

  return (
    <section id="location" className="py-20 bg-lume-gray/20">
      <div className="container mx-auto px-4">
        <h2 className="font-display font-bold text-3xl md:text-4xl text-lume-deep-blue mb-12 text-center">
          Localização Privilegiada
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
              <p>
                O Espaço Lume está situado na{' '}
                <span className="font-bold text-lume-deep-blue">
                  Vila Arens
                </span>
                , um dos bairros mais tradicionais e bem localizados de Jundiaí.
              </p>
              <p>
                A região oferece facilidade de acesso, alto fluxo de pessoas e
                uma vizinhança qualificada, ideal para o seu negócio prosperar.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Bus className="w-6 h-6 text-lume-mint mt-1" />
                <div>
                  <h4 className="font-bold text-lume-deep-blue">
                    Acesso Fácil
                  </h4>
                  <p className="text-sm text-lume-deep-blue/70">
                    Próximo a pontos de ônibus e vias rápidas.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building className="w-6 h-6 text-lume-mint mt-1" />
                <div>
                  <h4 className="font-bold text-lume-deep-blue">Vizinhança</h4>
                  <p className="text-sm text-lume-deep-blue/70">
                    Clínicas, estúdios de pilates e comércio.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <GraduationCap className="w-6 h-6 text-lume-mint mt-1" />
                <div>
                  <h4 className="font-bold text-lume-deep-blue">
                    Instituições
                  </h4>
                  <p className="text-sm text-lume-deep-blue/70">
                    Próximo à FMJ e Colégio Divino Salvador.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-lume-mint mt-1" />
                <div>
                  <h4 className="font-bold text-lume-deep-blue">
                    Conveniência
                  </h4>
                  <p className="text-sm text-lume-deep-blue/70">
                    Alto fluxo de pessoas e segurança.
                  </p>
                </div>
              </div>
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3663.887466666666!2d-46.88666666666666!3d-23.19666666666666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cf266666666667%3A0x0!2sR.%20Moreira%20C%C3%A9sar%2C%20319%20-%20Vila%20Arens%20II%2C%20Jundia%C3%AD%20-%20SP%2C%2013202-600!5e0!3m2!1sen!2sbr!4v1600000000000!5m2!1sen!2sbr"
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
