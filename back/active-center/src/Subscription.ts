import { Subscriptions } from "./Subscription/SubscriptionDTO/Subscription.enum";

export const subscriptionGold = {
    name: Subscriptions.GOLD,
    description: 'Plan exclusivo con acceso total a todas las instalaciones y beneficios premium.',
    percentage: 20, // Descuento o porcentaje de beneficio aplicable
    benefits: [
      'Acceso ilimitado al gimnasio y la piscina.',
      'Acceso a áreas VIP (sauna, spa, zona de relajación).',
      '5 sesiones mensuales con entrenador personal.',
      'Participación gratuita en eventos deportivos exclusivos.',
      'Acceso a reserva prioritaria de canchas deportivas.',
      'Acceso a todas las actividades del club.'
    ],
    price: 20,
    duration: 31,
} 