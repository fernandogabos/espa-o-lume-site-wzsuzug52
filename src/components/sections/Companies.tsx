import {
  Globe,
  Instagram,
  Facebook,
  Linkedin,
  Phone,
  Mail,
  MessageCircle,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useInView } from '@/hooks/use-in-view'
import { cn } from '@/lib/utils'
import { CompaniesSection } from '@/types/content'

export function Companies({
  content,
}: {
  content: CompaniesSection['content']
}) {
  const { ref, hasTriggered } = useInView({ threshold: 0.1 })

  const activeCompanies = content.items.filter((item) => item.active)

  if (activeCompanies.length === 0) return null

  return (
    <section id="companies" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-display font-bold text-3xl md:text-4xl text-lume-deep-blue mb-4 text-center">
          {content.title}
        </h2>
        {content.description && (
          <p className="text-center text-lume-deep-blue/70 mb-12 max-w-2xl mx-auto">
            {content.description}
          </p>
        )}

        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {activeCompanies.map((company, index) => (
            <Card
              key={company.id}
              className={cn(
                'overflow-hidden border border-gray-100 hover:border-lume-mint/50 hover:shadow-lg transition-all duration-500 bg-white group',
                hasTriggered
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8',
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 flex flex-col items-center text-center h-full">
                <div className="h-32 w-full flex items-center justify-center mb-6 bg-gray-50 rounded-lg p-4 group-hover:bg-white transition-colors">
                  {company.logos.length > 0 ? (
                    <img
                      src={company.logos[0]}
                      alt={company.name}
                      className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 opacity-80 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm font-medium">
                      {company.name}
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-lg text-lume-deep-blue mb-4">
                  {company.name}
                </h3>

                <div className="flex gap-3 mt-auto justify-center flex-wrap">
                  {company.contact.website && (
                    <SocialLink
                      href={company.contact.website}
                      icon={Globe}
                      label="Website"
                    />
                  )}
                  {company.contact.instagram && (
                    <SocialLink
                      href={company.contact.instagram}
                      icon={Instagram}
                      label="Instagram"
                    />
                  )}
                  {company.contact.facebook && (
                    <SocialLink
                      href={company.contact.facebook}
                      icon={Facebook}
                      label="Facebook"
                    />
                  )}
                  {company.contact.linkedin && (
                    <SocialLink
                      href={company.contact.linkedin}
                      icon={Linkedin}
                      label="LinkedIn"
                    />
                  )}
                  {company.contact.whatsapp && (
                    <SocialLink
                      href={`https://wa.me/${company.contact.whatsapp.replace(/\D/g, '')}`}
                      icon={MessageCircle}
                      label="WhatsApp"
                    />
                  )}
                  {company.contact.phone && (
                    <SocialLink
                      href={`tel:${company.contact.phone}`}
                      icon={Phone}
                      label="Telefone"
                    />
                  )}
                  {company.contact.email && (
                    <SocialLink
                      href={`mailto:${company.contact.email}`}
                      icon={Mail}
                      label="Email"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function SocialLink({ href, icon: Icon, label }: any) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-gray-50 text-gray-500 hover:bg-lume-mint hover:text-white transition-colors transform hover:scale-110"
        >
          <Icon className="w-4 h-4" />
          <span className="sr-only">{label}</span>
        </a>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  )
}
