import { createCheckoutSession } from "@/service/striperService";
import { loadStripe } from "@stripe/stripe-js";

// Verifica que la clave de Stripe esté definida
const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
if (!stripePublicKey) {
  throw new Error(
    "La clave pública de Stripe no está definida en las variables de entorno."
  );
}

const stripePromise = loadStripe(stripePublicKey);

const CheckoutButton = ({ products }) => {
  const handleCheckout = async () => {
    const stripe = await stripePromise;
    if (!stripe) return;

    try {
      const session = await createCheckoutSession(products);
      stripe.redirectToCheckout({ sessionId: session.id });
    } catch (error) {
      console.error("Error al iniciar el pago:", error);
    }
  };

  return <button onClick={handleCheckout}>Pagar</button>;
};

export default CheckoutButton;
