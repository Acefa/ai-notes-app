import { manageSubscriptionStatusChange, updateStripeCustomer } from "@/actions/stripe-actions";
import stripe from "@/lib/stripe";
import Stripe from "stripe";

const relevantEvents = new Set(["checkout.session.completed", "customer.subscription.updated", "customer.subscription.deleted"]);

export async function POST(request: Request): Promise<Response> {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  if (!signature) {
    console.error("Stripe signature missing");
    return new Response("Stripe signature missing", { status: 400 });
  }

  if (!webhookSecret) {
    console.error("Stripe webhook secret missing in environment variables");
    return new Response("Stripe webhook secret not configured", { status: 500 });
  }

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log(`Webhook received: ${event.type}`);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return new Response(
      `Webhook Error: ${error instanceof Error ? error.message : 'Unknown Error'}`,
      { status: 400 }
    );
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          await handleSubscriptionChange(event);
          break;

        case "checkout.session.completed":
          await handleCheckoutSession(event);
          break;

        default:
          throw new Error("Unhandled relevant event!");
      }
    } catch (error) {
      console.error("Webhook handler failed:", error);
      return new Response("Webhook handler failed. View your nextjs function logs.", {
        status: 400
      });
    }
  }

  return new Response(JSON.stringify({ received: true }));
}

async function handleSubscriptionChange(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  const productId = subscription.items.data[0].price.product as string;
  await manageSubscriptionStatusChange(subscription.id, subscription.customer as string, productId);
}

async function handleCheckoutSession(event: Stripe.Event) {
  const checkoutSession = event.data.object as Stripe.Checkout.Session;
  if (checkoutSession.mode === "subscription") {
    const subscriptionId = checkoutSession.subscription as string;
    await updateStripeCustomer(checkoutSession.client_reference_id as string, subscriptionId, checkoutSession.customer as string);

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["default_payment_method"]
    });

    const productId = subscription.items.data[0].price.product as string;
    await manageSubscriptionStatusChange(subscription.id, subscription.customer as string, productId);
  }
}