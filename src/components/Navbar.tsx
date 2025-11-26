import { useState, useEffect } from 'react'
import { Menu, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useCMS } from '@/contexts/CMSContext'

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'Quem Somos', href: '#about' },
  { name: 'Estrutura', href: '#structure' },
  { name: 'Salas Disponíveis', href: '#rooms' },
  { name: 'Benefícios', href: '#benefits' },
  { name: 'Localização', href: '#location' },
  { name: 'Fotos', href: '#gallery' },
  { name: 'Contato', href: '#contact' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [isOpen, setIsOpen] = useState(false)
  const { data } = useCMS()
  const { config } = data

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)

      // Determine active section
      const sections = navItems.map((item) => item.href.substring(1))
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsOpen(false)
    }
  }

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-[70px] md:h-[80px] flex items-center',
        isScrolled ? 'glass-nav' : 'bg-transparent',
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a
          href="#home"
          onClick={(e) => scrollToSection(e, '#home')}
          className="flex items-center gap-2 group"
        >
          <div className="relative flex items-center">
            {config.logo ? (
              <img
                src={config.logo}
                alt="Espaço Lume"
                className="h-12 w-auto object-contain"
              />
            ) : (
              <>
                <Flame className="w-8 h-8 md:w-10 md:h-10 text-lume-yellow fill-lume-yellow mr-2" />
                <div className="flex flex-col leading-none">
                  <span className="font-serif text-2xl md:text-3xl text-black tracking-wide">
                    ESPAÇO
                  </span>
                  <span className="font-serif text-3xl md:text-4xl text-black font-bold -mt-1 md:-mt-2">
                    LUME
                  </span>
                </div>
              </>
            )}
          </div>
        </a>

        {/* Desktop Menu */}
        <div className="hidden xl:flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href)}
              className={cn(
                'text-sm font-medium transition-colors duration-200 hover:text-lume-mint relative py-1',
                activeSection === item.href.substring(1)
                  ? 'text-lume-mint font-semibold'
                  : isScrolled
                    ? 'text-lume-deep-blue'
                    : 'text-lume-deep-blue xl:text-white xl:shadow-black/10 xl:drop-shadow-md',
              )}
            >
              {item.name}
              {activeSection === item.href.substring(1) && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-lume-mint rounded-full animate-fade-in" />
              )}
            </a>
          ))}
        </div>

        {/* Mobile Menu */}
        <div className="xl:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'hover:text-lume-mint',
                  isScrolled
                    ? 'text-lume-deep-blue'
                    : 'text-lume-deep-blue md:text-white',
                )}
              >
                <Menu className="h-8 w-8" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-white/95 backdrop-blur-xl border-l border-lume-gray"
            >
              <SheetTitle className="text-left mb-6 font-display text-xl text-lume-deep-blue">
                Menu
              </SheetTitle>
              <div className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => scrollToSection(e, item.href)}
                    className={cn(
                      'text-lg font-medium py-2 border-b border-lume-gray/50 transition-colors',
                      activeSection === item.href.substring(1)
                        ? 'text-lume-mint'
                        : 'text-lume-deep-blue',
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
