import { IProducts } from "../../interface/IProducts";
import { ProductState } from "../../interface/IProducts";

export const products: IProducts[] = [
  {
    id: "1",
    name: "Raqueta de Tennis",
    price: 699,
    description:
      "Raqueta de alta calidad, ideal para jugadores principiantes y avanzados.                                                                                                                                ",
    image:
      "https://res.cloudinary.com/dqiehommi/image/upload/v1737862989/raqueta_de_tennis_qqun1x.png",
    stock: 10,
    State: ProductState.Disponible,
  },
  {
    id: "2",
    name: "Paleta de Paddel",
    price: 999,
    description:
      "Paleta de pádel con diseño ergonómico para un mejor control y potencia.",
    image:
      "https://res.cloudinary.com/dqiehommi/image/upload/v1737857647/raqueta_padel_cbdx5w.png",
    stock: 0,
    State: ProductState.SinStock,
  },
  {
    id: "3",
    name: "Bolso de entrenamiento",
    price: 799,
    description:
      "Creado con materiales duraderos, cuenta con compartimentos y correas ajustables.",
    image:
      "https://res.cloudinary.com/dqiehommi/image/upload/v1737857647/bolso_gym_mhynlt.png",
    stock: 10,
    State: ProductState.Retirado,
  },
  {
    id: "4",
    name: "Pelotas de Paddel y Tennis",
    price: 399,
    description:
      "Set de pelotas de pádel y tennis con rebote óptimo para partidos competitivos.",
    image:
      "https://res.cloudinary.com/dqiehommi/image/upload/v1737863485/PELOTAS_yziq50.png",
    stock: 10,
    State: ProductState.Disponible,
  },
  {
    id: "5",
    name: "Botines unisex",
    price: 249,
    description:
      "Diseño moderno y gran tracción en césped natural o sintético.",
    image:
      "https://res.cloudinary.com/dqiehommi/image/upload/v1737862763/unisex_botin.21_ihrdfs.png",
    stock: 0,
    State: ProductState.SinStock,
  },
  {
    id: "6",
    name: "Camisetas deportivas",
    price: 99,
    description:
      "Camisetas con tecnología transpirable, ideales para entrenamientos y partidos.",
    image:
      "https://res.cloudinary.com/dqiehommi/image/upload/v1737857647/Camiseta_deportiva_unisex_a8a3en.png",
    stock: 10,
    State: ProductState.Disponible,
  },
  {
    id: "7",
    name: "Kit de Natación",
    price: 199,
    description:
      "Incluye gorro, gafas y tapones de natación para entrenamientos en piscina.",
    image:
      "https://res.cloudinary.com/dqiehommi/image/upload/v1737857647/kit_natacion_bbj7zn.png",
    stock: 5,
    State: ProductState.Disponible,
  },
  {
    id: "8",
    name: "Toalla de Secado Rápido",
    price: 99,
    description:
      "Toalla ultraligera y compacta con capacidad de secado rápido.",
    image:
      "https://res.cloudinary.com/dqiehommi/image/upload/v1737857649/toalla_secado_rapido_q5cb4t.png",
    stock: 0,
    State: ProductState.SinStock,
  },
];
