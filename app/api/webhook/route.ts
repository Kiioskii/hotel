import { createBooking, updateHotelRoom } from "@/app/libs/apis";
import { metadata } from "./../../(web)/layout";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const checkout_session_completed = "checkout.session.completed";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-08-16",
});

export async function POST(req: Request, res: Response) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") || "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (!signature || !webhookSecret) return;

    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    switch (event.type) {
      case checkout_session_completed:
        const session = event.data.object as Stripe.Checkout.Session;

        const {
          metadata: {
            checkInDate,
            checkOutDate,
            adults,
            children,
            hotelRoom,
            numberOfDays,
            user,
            discount,
            totalPrice,
          },
        } = session;

        await createBooking({
          checkInDate,
          checkOutDate,
          adults: Number(adults),
          children: Number(children),
          hotelRoom,
          numberOfDays: Number(numberOfDays),
          user,
          discount: Number(discount),
          totalPrice: Number(totalPrice),
        });

        await updateHotelRoom(hotelRoom);

        return NextResponse.json("Booking successful", {
          status: 200,
          statusText: "Booking successful",
        });
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error: any) {
    return new NextResponse(`Webhook error: ${error.message}`, { status: 500 });
  }
  return NextResponse.json("Event received", {
    status: 200,
    statusText: "Event received",
  });
}
