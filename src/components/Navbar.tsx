import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)

      // Determine active section
      const sections = navItems.map((item) => item.href.substring(1))
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-[60px] md:h-[70px] flex items-center',
        isScrolled ? 'glass-nav shadow-sm' : 'bg-transparent',
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a
          href="#home"
          onClick={(e) => scrollToSection(e, '#home')}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 md:w-10 md:h-10 bg-lume-mint rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <span className="font-display font-bold text-xl md:text-2xl text-lume-deep-blue tracking-tight">
            Espaço Lume
          </span>
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
                  : 'text-lume-deep-blue',
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
                className="text-lume-deep-blue hover:text-lume-mint"
              >
                <Menu className="h-6 w-6" />
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
