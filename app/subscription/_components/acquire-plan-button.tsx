"use client";

import { Button } from "@/app/_components/ui/button";
import { createStripeCheckout } from "../_actions/create-stripe-checkout";
import { loadStripe } from "@stripe/stripe-js";

const AcquirePlanButton = () => {
  const handleAcquirePlan = async () => {
    // Lógica para adquirir o plano (ex: redirecionar para o checkout do Stripe)
    const { sessionId } = await createStripeCheckout();
    if (!process.env.NEXT_PUBLLIC_STRIPE_PUBLISHABLE_KEY) {
      throw new Error("Missing NEXT_PUBLLIC_STRIPE_PUBLISHABLE_KEY");
    }
    const stripe = await loadStripe(
      process.env.NEXT_PUBLLIC_STRIPE_PUBLISHABLE_KEY,
    );
    if (!stripe) {
      throw new Error("Stripe failed to load");
    }
    await stripe.redirectToCheckout({ sessionId });
  };

  return (
    <Button className="w-full rounded-full" onClick={handleAcquirePlan}>
      Adquirir Plano
    </Button>
  );
};

export default AcquirePlanButton;
