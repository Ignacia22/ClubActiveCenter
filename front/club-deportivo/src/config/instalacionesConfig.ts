export interface Instalacion {
    id: string;
    titulo: string;
    descripcion: string;
    imagen: string;
    detalles: string[];
    caracteristicas: string[];
  }
  
  export const instalacionesConfig: Instalacion[] = [
    {
      id: "futbol",
      titulo: "Cancha de Fútbol",
      descripcion: "Instalación profesional para la práctica de fútbol con césped de última generación.",
      imagen: "/images/instalaciones/futbol.jpg",
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
      titulo: "Cancha de Tenis 1",
      descripcion: "Canchas de tenis con superficies de última generación para entrenamiento y competición.",
      imagen: "/images/instalaciones/tennis.jpg",
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
        id: "Padel",
        titulo: "Cancha de Tenis",
        descripcion: "Canchas de tenis con superficies de última generación para entrenamiento y competición.",
        imagen: "/images/instalaciones/tennis.jpg",
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
      }
  ];