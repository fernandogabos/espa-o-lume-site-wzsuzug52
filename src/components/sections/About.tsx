import { useInView } from '@/hooks/use-in-view'
import { cn } from '@/lib/utils'

export function About() {
  const { ref, hasTriggered } = useInView({ threshold: 0.2 })

  return (
    <section id="about" className="py-20 bg-lume-gray/30">
      <div className="container mx-auto px-4">
        <div
          ref={ref}
          className={cn(
            'max-w-4xl mx-auto text-center transition-all duration-1000',
            hasTriggered
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10',
          )}
        >
          <h2 className="font-display font-bold text-3xl md:text-4xl text-lume-deep-blue mb-8">
            Quem Somos
          </h2>

          <div className="space-y-6 text-lg text-lume-deep-blue/80 leading-relaxed">
            <p>
              O{' '}
              <span className="font-semibold text-lume-mint">Espaço Lume</span>{' '}
              é um ambiente profissional acolhedor, idealizado para
              profissionais das áreas de{' '}
              <span className="font-medium">
                saúde, pedagogia, estética, jurídico e administrativo
              </span>{' '}
              que buscam excelência em seus atendimentos.
            </p>

            <div className="bg-white p-8 rounded-2xl shadow-subtle border-l-4 border-lume-mint my-8">
              <p className="italic text-lume-deep-blue font-medium">
                "Localizado na privilegiada Vila Arens, em Jundiaí, próximo à
                Faculdade de Medicina de Jundiaí (FMJ) e ao Colégio Divino
                Salvador, oferecemos conveniência e prestígio para o seu
                negócio."
              </p>
            </div>

            <p>
              Nosso propósito é oferecer uma estrutura moderna, com conforto,
              segurança e uma experiência positiva tanto para os profissionais
              quanto para seus clientes. Cuidamos de cada detalhe para que você
              possa focar no que realmente importa: o seu trabalho.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
