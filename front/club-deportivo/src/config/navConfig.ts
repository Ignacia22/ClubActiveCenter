export interface NavItem {
  text: string;
  path: string;
  isPrivate?: boolean;
  subItems?: NavItem[];
}

export const navConfig: NavItem[] = [
  { text: "Home", path: "/home", isPrivate: false },
  { text: "Nosotros", path: "/nosotros", isPrivate: false },
  { text: "Planes y Membresias", path: "/Membresias", isPrivate: false },
  { text: "Reservas", path: "/Reservas", isPrivate: false },
  { text: "Tienda", path: "/tienda", isPrivate: false },

  {
    text: "Instalaciones",
    path: "/instalaciones-2",
    isPrivate: false,
    subItems: [
      { text: "Futbol", path: "/instalaciones/futbol" },
      { text: "Tennis", path: "/instalaciones/tennis" },
      { text: "Padel", path: "/instalaciones/padel" },
      { text: "Natacion", path: "/instalaciones/natacion" },
    ],
  },
  { text: "Actividades", path: "/actividades", isPrivate: false },
];
