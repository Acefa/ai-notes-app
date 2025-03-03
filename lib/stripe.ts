import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
  appInfo: {
    name: "AI notes app",
    version: "1.0.0",
    
  },
});

export default stripe;


