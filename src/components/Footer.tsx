import { Instagram, MapPin, Phone, Mail, Clock, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCMS } from '@/contexts/CMSContext'

export function Footer() {
  const { data } = useCMS()
  const { config } = data

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-lume-cream pt-16 pb-8 border-t border-lume-mint/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {config.logo ? (
                <img
                  src={config.logo}
                  alt="Espaço Lume"
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <>
                  <Flame className="w-6 h-6 text-lume-yellow fill-lume-yellow" />
                  <div className="flex flex-col leading-none">
                    <span className="font-serif text-lg text-lume-deep-blue tracking-wide">
                      ESPAÇO
                    </span>
                    <span className="font-serif text-xl text-lume-deep-blue font-bold -mt-1">
                      LUME
                    </span>
                  </div>
                </>
              )}
            </div>
            <p className="text-lume-deep-blue/80 text-sm leading-relaxed">
              {config.description}
            </p>
            <div className="flex gap-4">
              <a
                href={config.contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lume-deep-blue hover:text-lume-mint transition-colors"
              >
                <Instagram className="w-5 h-5" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold text-lume-deep-blue mb-4">
              Navegação
            </h3>
            <ul className="space-y-2">
              {[
                'Home',
                'Quem Somos',
                'Estrutura',
                'Salas Disponíveis',
                'Benefícios',
                'Localização',
                'Fotos',
                'Contato',
              ].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item === 'Home' ? 'home' : item === 'Quem Somos' ? 'about' : item === 'Estrutura' ? 'structure' : item === 'Salas Disponíveis' ? 'rooms' : item === 'Benefícios' ? 'benefits' : item === 'Localização' ? 'location' : item === 'Fotos' ? 'gallery' : 'contact'}`}
                    className="text-sm text-lume-deep-blue/80 hover:text-lume-mint transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display font-bold text-lume-deep-blue mb-4">
              Contato
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-lume-deep-blue/80">
                <MapPin className="w-4 h-4 mt-1 text-lume-mint shrink-0" />
                <span>{config.contact.address}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-lume-deep-blue/80">
                <Phone className="w-4 h-4 text-lume-mint shrink-0" />
                <span>{config.contact.phone}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-lume-deep-blue/80">
                <Mail className="w-4 h-4 text-lume-mint shrink-0" />
                <span>{config.contact.email}</span>
              </li>
            </ul>
          </div>

          {/* Hours & CTA */}
          <div>
            <h3 className="font-display font-bold text-lume-deep-blue mb-4">
              Horário de Funcionamento
            </h3>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-3 text-sm text-lume-deep-blue/80">
                <Clock className="w-4 h-4 mt-1 text-lume-mint shrink-0" />
                <div>
                  <p>Seg - Sex: {config.contact.hours.weekdays}</p>
                  <p>Sáb: {config.contact.hours.saturday}</p>
                </div>
              </li>
            </ul>
            <Button
              onClick={scrollToContact}
              className="w-full bg-lume-mint hover:bg-lume-mint/90 text-white font-semibold"
            >
              Agende uma Visita
            </Button>
          </div>
        </div>

        <div className="border-t border-lume-deep-blue/10 pt-8 text-center">
          <p className="text-xs text-lume-deep-blue/60">
            © {new Date().getFullYear()} Espaço Lume. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
