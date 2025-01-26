export interface Instalacion {
  id: string;
  titulo: string;
  titulo2: string;
  descripcion: string;
  images: string;
  carruselImagenes: string[];
  detalles: string[];
  caracteristicas: string[];
}

export const instalacionesConfig: Instalacion[] = [
  {
    id: "futbol",
    titulo: "Canchas de Fútbol",
    titulo2: "FUTBOL",
    descripcion: "Instalación profesional para la práctica de fútbol con césped de última generación.",
    images: "https://res.cloudinary.com/dqiehommi/image/upload/v1737847006/pexels-kaio-murilo-236638494-12201296_w480z4.jpg",
    carruselImagenes: [
      "https://res.cloudinary.com/dqiehommi/image/upload/v1737839605/pexels-ali-bensoula-555682561-30314838_1_vnowu0.jpg",
      "https://res.cloudinary.com/dqiehommi/image/upload/v1737839581/pexels-itiel-cd-3047539-29485141_jkzwhp.jpg",
      "https://res.cloudinary.com/dqiehommi/image/upload/v1737839576/pexels-tomfisk-3507477_g1cosp.jpg"
    ],
    detalles: [
      "Superficie de césped sintético",
      "Medidas reglamentarias",
      "Iluminación LED",
      "Vestuarios equipados"
    ],
    caracteristicas: [
      "Césped sintético de alta calidad",
      "Marcación oficial",
      "Sistemas de drenaje",
      "Capacidad para entrenamientos y partidos"
    ]
  },
  {
    id: "tennis",
    titulo: "Canchas de Tenis",
    titulo2: "TENIS",
    descripcion: "Canchas de tenis con superficies de última generación para entrenamiento y competición.",
    images: "https://res.cloudinary.com/dqiehommi/image/upload/v1737851182/pexels-cottonbro-5739116_dr18g3.jpg",
    carruselImagenes: [
      "https://res.cloudinary.com/dqiehommi/image/upload/v1737837877/Abrazo_zw00me.jpg",
      "https://res.cloudinary.com/dqiehommi/image/upload/v1737837875/Lanzar_f5ruzy.jpg",
      "https://res.cloudinary.com/dqiehommi/image/upload/v1737837872/jugando-tenis_mo73oh.jpg"
    ],
    detalles: [
      "Superficie de arcilla sintética",
      "Iluminación nocturna",
      "Gradas para espectadores",
      "Vestuarios individuales"
    ],
    caracteristicas: [
      "Superficie adaptada a diferentes estilos de juego",
      "Mantenimiento constante",
      "Sistemas de riego automático",
      "Zonas de calentamiento"
    ]
  },
  {
    id: "padel",
    titulo: "Canchas de Pádel",
    titulo2: "PÁDEL",
    descripcion: "Cancha de pádel moderna diseñada para jugadores de todos los niveles, equipada con las mejores instalaciones.",
    images: "https://res.cloudinary.com/dqiehommi/image/upload/v1737851593/pexels-roger-aribau-gisbert-19420784-15612080_vdkyr0.jpg",
    carruselImagenes: [
      "https://res.cloudinary.com/dqiehommi/image/upload/v1737840151/pexels-sergio-contreras-arcos-246994617-20823438_dcdjqr.jpg",
      "https://res.cloudinary.com/dqiehommi/image/upload/v1737840237/pexels-ollivves-1103829_wlo9l3.jpg",
      "https://res.cloudinary.com/dqiehommi/image/upload/v1737840322/pexels-praksh-7160122_ftapna.jpg"
    ],
    detalles: [
      "Superficie sintética de alta calidad",
      "Cristales templados de seguridad",
      "Iluminación LED para uso nocturno",
      "Vestuarios con duchas y lockers"
    ],
    caracteristicas: [
      "Dimensiones reglamentarias",
      "Mantenimiento diario",
      "Redes de competición",
      "Zonas de descanso cercanas"
    ]
  },
  {
    id: "natacion",
    titulo: "Piscinas Olímpica",
    titulo2: "NATACIÓN",
    descripcion: "Piscina de medidas olímpicas equipada con tecnología de última generación para entrenamiento y competición.",
    images: "https://res.cloudinary.com/dqiehommi/image/upload/v1737851793/pexels-ajaybhargavguduru-863988_u21l56.jpg",
    carruselImagenes: [
      "https://res.cloudinary.com/dqiehommi/image/upload/v1737840421/pexels-alexey-komissarov-85164430-9022668_jga9zu.jpg",
      "https://res.cloudinary.com/dqiehommi/image/upload/v1737840424/pexels-jim-de-ramos-395808-1263425_mkhmzn.jpg",
      "https://res.cloudinary.com/dqiehommi/image/upload/v1737840425/pexels-kindelmedia-8688552_xvgqiu.jpg"
    ],
    detalles: [
      "Medidas oficiales de 50 metros",
      "8 carriles demarcados",
      "Sistema de climatización del agua",
      "Gradas para espectadores",
      "Vestuarios modernos con duchas"
    ],
    caracteristicas: [
      "Cronometraje electrónico",
      "Sistemas de filtración y purificación avanzados",
      "Iluminación subacuática",
      "Espacios para calentamiento y recuperación"
    ]
  }
];