import { CMSData } from '@/types/content'

export const initialContent: CMSData = {
  config: {
    title: 'Espaço Lume - Ambiente Profissional em Jundiaí',
    description:
      'Um ambiente profissional acolhedor em Jundiaí, transmitindo conforto, leveza, credibilidade e modernidade.',
    ogImage: 'https://img.usecurling.com/p/1200/630?q=office%20interior&dpr=1',
    logo: null,
    contact: {
      phone: '(11) 99875-4842',
      email: 'contato@espacolume.com.br',
      address: 'Rua Moreira Cesar, 319, Vila Arens II, 13.202-600 - Jundiai/SP',
      instagram: 'https://www.instagram.com/espacolumejdi/',
      whatsapp: '5511998754842',
      hours: {
        weekdays: '07h às 21h',
        saturday: '07h às 13h',
      },
    },
    colors: {
      mint: '#94D1B4',
      sky: '#AFD9FF',
      gray: '#E8E8E8',
      cream: '#F7F3E9',
      deepBlue: '#2F4F6F',
      yellow: '#FFD700',
    },
  },
  sections: [
    {
      id: 'hero',
      type: 'hero',
      isVisible: true,
      title: 'Banner Principal',
      content: {
        title: 'Conforto, Leveza e Credibilidade',
        subtitle:
          'Um ambiente profissional acolhedor na Vila Arens, Jundiaí, projetado para inspirar e conectar profissionais.',
        buttonText: 'Agendar Visita',
        backgroundImage:
          'https://img.usecurling.com/p/1920/1080?q=modern%20office%20reception%20cozy&dpr=2',
      },
    },
    {
      id: 'features',
      type: 'features',
      isVisible: true,
      title: 'Destaques',
      content: {
        items: [
          {
            icon: 'MapPin',
            title: 'Localização',
            description: 'Vila Arens, fácil acesso e região nobre.',
          },
          {
            icon: 'Building2',
            title: 'Estrutura Completa',
            description: 'Salas modernas, climatizadas e equipadas.',
          },
          {
            icon: 'ShieldCheck',
            title: 'Segurança',
            description: 'Monitoramento 24h, alarme e cerca elétrica.',
          },
          {
            icon: 'Coffee',
            title: 'Serviços Inclusos',
            description: 'Água, luz, internet e limpeza.',
          },
          {
            icon: 'Users',
            title: 'Multidisciplinar',
            description: 'Networking com profissionais de diversas áreas.',
          },
        ],
      },
    },
    {
      id: 'about',
      type: 'about',
      isVisible: true,
      title: 'Quem Somos',
      content: {
        title: 'Quem Somos',
        text: 'O Espaço Lume é um ambiente profissional acolhedor, idealizado para profissionais das áreas de saúde, pedagogia, estética, jurídico e administrativo que buscam excelência em seus atendimentos.',
        highlight:
          '"Localizado na privilegiada Vila Arens, em Jundiaí, próximo à Faculdade de Medicina de Jundiaí (FMJ) e ao Colégio Divino Salvador, oferecemos conveniência e prestígio para o seu negócio."',
        closing:
          'Nosso propósito é oferecer uma estrutura moderna, com conforto, segurança e uma experiência positiva tanto para os profissionais quanto para seus clientes. Cuidamos de cada detalhe para que você possa focar no que realmente importa: o seu trabalho.',
      },
    },
    {
      id: 'structure',
      type: 'structure',
      isVisible: true,
      title: 'Estrutura',
      content: {
        title: 'Nossa Estrutura',
        items: [
          {
            icon: 'Coffee',
            title: 'Área de espera',
            description: 'Com café e água para seus clientes.',
            image:
              'https://img.usecurling.com/p/400/300?q=waiting%20room%20coffee%20cozy&dpr=2',
          },
          {
            icon: 'Wind',
            title: 'Ambientes climatizados',
            description: 'Conforto térmico em todas as salas.',
            image:
              'https://img.usecurling.com/p/400/300?q=air%20conditioner%20office&dpr=2',
          },
          {
            icon: 'Hammer',
            title: 'Salas recém reformadas',
            description: 'Acabamento moderno e impecável.',
            image:
              'https://img.usecurling.com/p/400/300?q=renovated%20office%20room&dpr=2',
          },
          {
            icon: 'Calendar',
            title: 'Sistema de agendamento',
            description: 'Gestão própria e facilitada.',
            image:
              'https://img.usecurling.com/p/400/300?q=calendar%20app%20tablet&dpr=2',
          },
          {
            icon: 'Camera',
            title: 'Monitoramento 24h',
            description: 'Câmeras para sua segurança.',
            image:
              'https://img.usecurling.com/p/400/300?q=security%20camera%20cctv&dpr=2',
          },
          {
            icon: 'ShieldAlert',
            title: 'Alarme e cerca elétrica',
            description: 'Proteção patrimonial completa.',
            image:
              'https://img.usecurling.com/p/400/300?q=electric%20fence%20security&dpr=2',
          },
          {
            icon: 'FileCheck',
            title: 'Documentação completa',
            description: 'AVCB e vigilância sanitária em dia.',
            image:
              'https://img.usecurling.com/p/400/300?q=approved%20document%20stamp&dpr=2',
          },
          {
            icon: 'Accessibility',
            title: 'Acessibilidade',
            description: 'Banheiros adaptados para PNE.',
            image:
              'https://img.usecurling.com/p/400/300?q=accessible%20bathroom%20sign&dpr=2',
          },
          {
            icon: 'Palette',
            title: 'Personalização',
            description: 'Possibilidade de personalizar sua sala.',
            image:
              'https://img.usecurling.com/p/400/300?q=interior%20design%20office%20decor&dpr=2',
          },
        ],
      },
    },
    {
      id: 'rooms',
      type: 'rooms',
      isVisible: true,
      title: 'Salas Disponíveis',
      content: {
        title: 'Salas Disponíveis',
        subtitle: 'Escolha o espaço ideal para o crescimento do seu negócio.',
        items: [
          {
            title: 'Sala 1',
            area: '11,17 m²',
            price: 'R$ 2.500',
            description:
              'Ideal para atendimentos individuais, psicologia ou nutrição.',
            features: ['Armário embutido', 'Climatizada', 'Iluminação natural'],
            image:
              'https://img.usecurling.com/p/600/400?q=office%20room%20wardrobe&dpr=2',
          },
          {
            title: 'Sala 2',
            area: '9,43 m²',
            price: 'R$ 2.000',
            description:
              'Perfeita para profissionais que buscam um espaço compacto e funcional.',
            features: ['Armário embutido', 'Climatizada', 'Silenciosa'],
            image:
              'https://img.usecurling.com/p/600/400?q=small%20office%20room%20cozy&dpr=2',
          },
          {
            title: 'Sala Fundo',
            area: '26,71 m²',
            price: 'R$ 3.500',
            description:
              'Espaço amplo para estúdios, pequenos grupos ou escritórios compartilhados.',
            features: ['Ampla área', 'Privacidade total', 'Banheiro próximo'],
            image:
              'https://img.usecurling.com/p/600/400?q=large%20office%20studio&dpr=2',
          },
        ],
      },
    },
    {
      id: 'benefits',
      type: 'benefits',
      isVisible: true,
      title: 'Benefícios',
      content: {
        title: 'Benefícios Exclusivos',
        items: [
          {
            icon: 'Wifi',
            title: 'Internet',
            description: 'Conexão de alta velocidade inclusa.',
          },
          {
            icon: 'Droplets',
            title: 'Água e Luz',
            description: 'Despesas básicas já inclusas no valor.',
          },
          {
            icon: 'CalendarCheck',
            title: 'Sistema de Agendamento',
            description: 'Exclusivo para gerenciar seus horários.',
          },
          {
            icon: 'Users',
            title: 'Ambiente Multidisciplinar',
            description: 'Networking com diversos profissionais.',
          },
          {
            icon: 'Key',
            title: 'Sublocação',
            description: 'Possibilidade mediante alinhamento.',
          },
          {
            icon: 'Shield',
            title: 'Segurança Completa',
            description: 'Monitoramento, alarme e cerca elétrica.',
          },
          {
            icon: 'MapPin',
            title: 'Localização Estratégica',
            description: 'Fácil acesso na Vila Arens.',
          },
          {
            icon: 'Heart',
            title: 'Ambiente Acolhedor',
            description: 'Pensado para o bem-estar de todos.',
          },
        ],
      },
    },
    {
      id: 'location',
      type: 'location',
      isVisible: true,
      title: 'Localização',
      content: {
        title: 'Localização Privilegiada',
        text: 'O Espaço Lume está situado na Vila Arens, um dos bairros mais tradicionais e bem localizados de Jundiaí. A região oferece facilidade de acesso, alto fluxo de pessoas e uma vizinhança qualificada, ideal para o seu negócio prosperar.',
        mapUrl:
          'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3663.887466666666!2d-46.88666666666666!3d-23.19666666666666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cf266666666667%3A0x0!2sR.%20Moreira%20C%C3%A9sar%2C%20319%20-%20Vila%20Arens%20II%2C%20Jundia%C3%AD%20-%20SP%2C%2013202-600!5e0!3m2!1sen!2sbr!4v1600000000000!5m2!1sen!2sbr',
        highlights: [
          {
            icon: 'Bus',
            title: 'Acesso Fácil',
            description: 'Próximo a pontos de ônibus e vias rápidas.',
          },
          {
            icon: 'Building',
            title: 'Vizinhança',
            description: 'Clínicas, estúdios de pilates e comércio.',
          },
          {
            icon: 'GraduationCap',
            title: 'Instituições',
            description: 'Próximo à FMJ e Colégio Divino Salvador.',
          },
          {
            icon: 'MapPin',
            title: 'Conveniência',
            description: 'Alto fluxo de pessoas e segurança.',
          },
        ],
      },
    },
    {
      id: 'gallery',
      type: 'gallery',
      isVisible: true,
      title: 'Galeria de Fotos',
      content: {
        title: 'Conheça o Espaço',
        images: [
          {
            src: 'https://img.usecurling.com/p/800/600?q=office%20waiting%20room%20cozy&dpr=2',
            alt: 'Área de Espera',
          },
          {
            src: 'https://img.usecurling.com/p/800/600?q=office%20interior%20design%20bright&dpr=2',
            alt: 'Ambientes Internos',
          },
          {
            src: 'https://img.usecurling.com/p/800/600?q=office%20corridor%20clean%20modern&dpr=2',
            alt: 'Design Moderno',
          },
          {
            src: 'https://img.usecurling.com/p/800/600?q=office%20window%20natural%20light&dpr=2',
            alt: 'Iluminação Natural',
          },
          {
            src: 'https://img.usecurling.com/p/800/600?q=office%20decor%20details&dpr=2',
            alt: 'Detalhes de Decoração',
          },
          {
            src: 'https://img.usecurling.com/p/800/600?q=office%20meeting%20room%20comfortable&dpr=2',
            alt: 'Aconchego',
          },
        ],
      },
    },
    {
      id: 'contact',
      type: 'contact',
      isVisible: true,
      title: 'Contato',
      content: {
        title: 'Entre em Contato',
        intro: 'Venha conhecer o espaço pessoalmente!',
        text: 'Estamos à disposição para tirar suas dúvidas e apresentar cada detalhe da nossa estrutura. Agende uma visita sem compromisso.',
      },
    },
  ],
}
