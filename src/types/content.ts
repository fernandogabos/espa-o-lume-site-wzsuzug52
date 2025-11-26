export type IconName =
  | 'Wifi'
  | 'CalendarCheck'
  | 'Users'
  | 'Key'
  | 'Shield'
  | 'MapPin'
  | 'Heart'
  | 'Zap'
  | 'Droplets'
  | 'Building2'
  | 'ShieldCheck'
  | 'Coffee'
  | 'Wind'
  | 'Hammer'
  | 'Calendar'
  | 'Camera'
  | 'ShieldAlert'
  | 'FileCheck'
  | 'Accessibility'
  | 'Palette'
  | 'Phone'
  | 'Mail'
  | 'Clock'
  | 'Flame'
  | 'Instagram'
  | 'Facebook'
  | 'Bus'
  | 'Building'
  | 'GraduationCap'

export interface SiteConfig {
  title: string
  description: string
  ogImage: string
  logo: string | null // URL to logo image, if null use default text/icon
  contact: {
    phone: string
    email: string
    address: string
    instagram: string
    whatsapp: string
    hours: {
      weekdays: string
      saturday: string
    }
  }
  colors: {
    mint: string
    sky: string
    gray: string
    cream: string
    deepBlue: string
    yellow: string
  }
}

export interface BaseSection {
  id: string
  type: string
  isVisible: boolean
  title: string // Internal name for admin
}

export interface HeroSection extends BaseSection {
  type: 'hero'
  content: {
    title: string
    subtitle: string
    buttonText: string
    backgroundImage: string
  }
}

export interface FeatureItem {
  icon: IconName
  title: string
  description: string
}

export interface FeaturesSection extends BaseSection {
  type: 'features'
  content: {
    items: FeatureItem[]
  }
}

export interface AboutSection extends BaseSection {
  type: 'about'
  content: {
    title: string
    text: string
    highlight: string
    closing: string
  }
}

export interface StructureItem {
  icon: IconName
  title: string
  description: string
  image: string
}

export interface StructureSection extends BaseSection {
  type: 'structure'
  content: {
    title: string
    items: StructureItem[]
  }
}

export interface RoomItem {
  title: string
  area: string
  price: string
  description: string
  features: string[]
  image: string
}

export interface RoomsSection extends BaseSection {
  type: 'rooms'
  content: {
    title: string
    subtitle: string
    items: RoomItem[]
  }
}

export interface BenefitItem {
  icon: IconName
  title: string
  description: string
}

export interface BenefitsSection extends BaseSection {
  type: 'benefits'
  content: {
    title: string
    items: BenefitItem[]
  }
}

export interface LocationSection extends BaseSection {
  type: 'location'
  content: {
    title: string
    text: string
    mapUrl: string
    highlights: { icon: IconName; title: string; description: string }[]
  }
}

export interface GalleryItem {
  src: string
  alt: string
}

export interface GallerySection extends BaseSection {
  type: 'gallery'
  content: {
    title: string
    images: GalleryItem[]
  }
}

export interface ContactSection extends BaseSection {
  type: 'contact'
  content: {
    title: string
    text: string
    intro: string
  }
}

export type Section =
  | HeroSection
  | FeaturesSection
  | AboutSection
  | StructureSection
  | RoomsSection
  | BenefitsSection
  | LocationSection
  | GallerySection
  | ContactSection

export interface CMSData {
  config: SiteConfig
  sections: Section[]
}
