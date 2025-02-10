// utils/stripe.ts
import { loadStripe } from "@stripe/stripe-js";

// Asegúrate de tener configurada la variable NEXT_PUBLIC_STRIPE_PUBLIC_KEY en tus archivos .env
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default stripePromise;
