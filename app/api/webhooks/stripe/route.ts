/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { clerkClient } from "@clerk/nextjs/server";

export const POST = async (req: Request) => {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("❌ Missing Stripe environment variables");
    return new NextResponse("Server misconfiguration", { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.error("❌ Missing stripe-signature header");
    return new NextResponse("Missing signature", { status: 400 });
  }

  const body = await req.text();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-10-28.acacia",
  });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("❌ Invalid Stripe signature:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  // 🧾 Tratar o evento "invoice.paid"
  if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice;

    const subscriptionId =
      (invoice.subscription as string) ||
      (invoice.parent as any)?.subscription_details?.subscription ||
      null;

    const clerkUserId =
      (invoice.metadata as any)?.clerk_user_id ||
      (invoice.parent as any)?.subscription_details?.metadata?.clerk_user_id ||
      (invoice.lines.data[0]?.metadata as any)?.clerk_user_id ||
      null;

    if (!subscriptionId) {
      console.error("❌ Invoice missing subscription ID");
      return new NextResponse("Missing subscription ID", { status: 400 });
    }

    if (!clerkUserId) {
      console.error("❌ Missing clerk_user_id in subscription metadata");
      return new NextResponse("Missing clerk_user_id", { status: 400 });
    }

    // ✅ Atualizar usuário no Clerk
    try {
      const clerk = await clerkClient();
      await clerk.users.updateUser(clerkUserId, {
        privateMetadata: {
          stripeCustomerId: invoice.customer as string,
          stripeSubscriptionId: subscriptionId,
        },
        publicMetadata: {
          subscriptionPlan: "premium",
        },
      });
      console.log("✅ Clerk user updated successfully:", clerkUserId);
    } catch (err) {
      console.error("❌ Failed to update Clerk user:", err);
      return new NextResponse("Clerk update failed", { status: 500 });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;

    const clerkUserId = (subscription.metadata as any)?.clerk_user_id || null;

    if (!clerkUserId) {
      console.error("❌ Missing clerk_user_id in subscription metadata");
      return new NextResponse("Missing clerk_user_id", { status: 400 });
    }

    // ✅ Atualizar usuário no Clerk
    try {
      const clerk = await clerkClient();
      await clerk.users.updateUser(clerkUserId, {
        privateMetadata: {
          stripeCustomerId: null,
          stripeSubscriptionId: null,
        },
        publicMetadata: {
          subscriptionPlan: null,
        },
      });
      console.log("✅ Clerk user updated successfully:", clerkUserId);
    } catch (err) {
      console.error("❌ Failed to update Clerk user:", err);
      return new NextResponse("Clerk update failed", { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
};
