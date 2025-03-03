import { updateProfile, updateProfileByStripeCustomerId } from "@/db/queries/profiles-queries";
import { SelectProfile } from "@/db/schema";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

type MembershipStatus = SelectProfile["membership"];

const getMembershipStatus = (status: Stripe.Subscription.Status, membership: MembershipStatus): MembershipStatus => {
  console.log(`[Stripe] Processing subscription status: ${status} for membership: ${membership}`);
  const result = (() => {
    switch (status) {
      case "active":
      case "trialing":
        return membership;
      case "canceled":
      case "incomplete":
      case "incomplete_expired":
      case "past_due":
      case "paused":
      case "unpaid":
        return "free";
      default:
        return "free";
    }
  })();
  console.log(`[Stripe] Determined membership status: ${result}`);
  return result;
};

const getSubscription = async (subscriptionId: string) => {
  console.log(`[Stripe] Retrieving subscription: ${subscriptionId}`);
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["default_payment_method"]
    });
    console.log(`[Stripe] Successfully retrieved subscription:`, {
      id: subscription.id,
      status: subscription.status,
      currentPeriodEnd: subscription.current_period_end
    });
    return subscription;
  } catch (error) {
    console.error(`[Stripe] Failed to retrieve subscription ${subscriptionId}:`, error);
    throw error;
  }
};

export const updateStripeCustomer = async (userId: string, subscriptionId: string, customerId: string) => {
  console.log(`[Stripe] Updating customer profile:`, { userId, subscriptionId, customerId });
  try {
    if (!userId || !subscriptionId || !customerId) {
      console.error('[Stripe] Missing required parameters:', { userId, subscriptionId, customerId });
      throw new Error("Missing required parameters for updateStripeCustomer");
    }

    const subscription = await getSubscription(subscriptionId);
    console.log(`[Stripe] Retrieved subscription for customer update:`, {
      subscriptionId: subscription.id,
      status: subscription.status
    });

    const updatedProfile = await updateProfile(userId, {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id
    });

    if (!updatedProfile) {
      console.error('[Stripe] Failed to update customer profile:', { userId, customerId });
      throw new Error("Failed to update customer profile");
    }

    console.log(`[Stripe] Successfully updated customer profile:`, {
      userId,
      customerId,
      subscriptionId: subscription.id
    });
    return updatedProfile;
  } catch (error) {
    console.error("[Stripe] Error in updateStripeCustomer:", error);
    throw error instanceof Error ? error : new Error("Failed to update Stripe customer");
  }
};

export const manageSubscriptionStatusChange = async (subscriptionId: string, customerId: string, productId: string): Promise<MembershipStatus> => {
  console.log(`[Stripe] Managing subscription status change:`, {
    subscriptionId,
    customerId,
    productId
  });
  
  try {
    if (!subscriptionId || !customerId || !productId) {
      console.error('[Stripe] Missing required parameters:', { subscriptionId, customerId, productId });
      throw new Error("Missing required parameters for manageSubscriptionStatusChange");
    }

    const subscription = await getSubscription(subscriptionId);
    console.log(`[Stripe] Retrieved subscription details:`, {
      status: subscription.status,
      currentPeriodEnd: subscription.current_period_end
    });

    const product = await stripe.products.retrieve(productId);
    console.log(`[Stripe] Retrieved product details:`, {
      productId: product.id,
      name: product.name,
      metadata: product.metadata
    });

    const membership = product.metadata.membership as MembershipStatus;
    if (!["free", "pro"].includes(membership)) {
      console.error(`[Stripe] Invalid membership type in product metadata:`, {
        productId,
        membership
      });
      throw new Error(`Invalid membership type in product metadata: ${membership}`);
    }

    const membershipStatus = getMembershipStatus(subscription.status, membership);
    console.log(`[Stripe] Determined new membership status:`, {
      oldStatus: subscription.status,
      newStatus: membershipStatus
    });

    await updateProfileByStripeCustomerId(customerId, {
      stripeSubscriptionId: subscription.id,
      membership: membershipStatus
    });

    console.log(`[Stripe] Successfully updated subscription status:`, {
      customerId,
      subscriptionId,
      membershipStatus
    });

    return membershipStatus;
  } catch (error) {
    console.error("[Stripe] Error in manageSubscriptionStatusChange:", error);
    throw error instanceof Error ? error : new Error("Failed to update subscription status");
  }
};