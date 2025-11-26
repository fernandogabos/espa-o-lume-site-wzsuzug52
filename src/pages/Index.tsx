import { Hero } from '@/components/sections/Hero'
import { Features } from '@/components/sections/Features'
import { About } from '@/components/sections/About'
import { Structure } from '@/components/sections/Structure'
import { Rooms } from '@/components/sections/Rooms'
import { Benefits } from '@/components/sections/Benefits'
import { Location } from '@/components/sections/Location'
import { Gallery } from '@/components/sections/Gallery'
import { Contact } from '@/components/sections/Contact'

const Index = () => {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <Features />
      <About />
      <Structure />
      <Rooms />
      <Benefits />
      <Location />
      <Gallery />
      <Contact />
    </div>
  )
}

export default Index
