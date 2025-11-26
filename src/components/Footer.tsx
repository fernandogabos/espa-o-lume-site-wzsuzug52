import { Facebook, Instagram, MapPin, Phone, Mail, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Footer() {
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
              <div className="w-8 h-8 bg-lume-mint rounded-full flex items-center justify-center">
                <span className="text-white font-bold">L</span>
              </div>
              <span className="font-display font-bold text-xl text-lume-deep-blue">
                Espaço Lume
              </span>
            </div>
            <p className="text-lume-deep-blue/80 text-sm leading-relaxed">
              Um ambiente profissional acolhedor, projetado para inspirar e
              conectar profissionais em Jundiaí.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-lume-deep-blue hover:text-lume-mint transition-colors"
              >
                <Instagram className="w-5 h-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="#"
                className="text-lume-deep-blue hover:text-lume-mint transition-colors"
              >
                <Facebook className="w-5 h-5" />
                <span className="sr-only">Facebook</span>
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
                'Contato',
              ].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item === 'Home' ? 'home' : item === 'Quem Somos' ? 'about' : item === 'Estrutura' ? 'structure' : item === 'Salas Disponíveis' ? 'rooms' : 'contact'}`}
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
                <span>Vila Arens, Jundiaí - SP</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-lume-deep-blue/80">
                <Phone className="w-4 h-4 text-lume-mint shrink-0" />
                <span>(11) 99999-9999</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-lume-deep-blue/80">
                <Mail className="w-4 h-4 text-lume-mint shrink-0" />
                <span>contato@espacolume.com.br</span>
              </li>
            </ul>
          </div>

          {/* Hours & CTA */}
          <div>
            <h3 className="font-display font-bold text-lume-deep-blue mb-4">
              Horário
            </h3>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-3 text-sm text-lume-deep-blue/80">
                <Clock className="w-4 h-4 mt-1 text-lume-mint shrink-0" />
                <div>
                  <p>Seg - Sex: 07h às 21h</p>
                  <p>Sáb: 07h às 13h</p>
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
