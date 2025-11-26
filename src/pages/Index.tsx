import { Hero } from '@/components/sections/Hero'
import { Features } from '@/components/sections/Features'
import { About } from '@/components/sections/About'
import { Structure } from '@/components/sections/Structure'
import { Rooms } from '@/components/sections/Rooms'
import { Benefits } from '@/components/sections/Benefits'
import { Location } from '@/components/sections/Location'
import { Gallery } from '@/components/sections/Gallery'
import { Contact } from '@/components/sections/Contact'
import { useCMS } from '@/contexts/CMSContext'

const Index = () => {
  const { data } = useCMS()

  return (
    <div className="flex flex-col w-full">
      {data.sections.map((section) => {
        if (!section.isVisible) return null

        switch (section.type) {
          case 'hero':
            return <Hero key={section.id} content={section.content} />
          case 'features':
            return <Features key={section.id} content={section.content} />
          case 'about':
            return <About key={section.id} content={section.content} />
          case 'structure':
            return <Structure key={section.id} content={section.content} />
          case 'rooms':
            return <Rooms key={section.id} content={section.content} />
          case 'benefits':
            return <Benefits key={section.id} content={section.content} />
          case 'location':
            return <Location key={section.id} content={section.content} />
          case 'gallery':
            return <Gallery key={section.id} content={section.content} />
          case 'contact':
            return (
              <Contact
                key={section.id}
                content={section.content}
                config={data.config}
              />
            )
          default:
            return null
        }
      })}
    </div>
  )
}

export default Index
