import { getRoom } from "@/app/libs/apis";
import { authOptions } from "@/app/libs/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2025-04-30.basil",
});

type RequestData = {
    checkInDate: string;
    checkOutDate: string;
    adults: number;
    children: number;
    hotelRoomSlug: string;
    numberOfDays: number;
};

export async function POST(req: Request) {
    const { checkInDate, checkOutDate, adults, children, hotelRoomSlug, numberOfDays }: RequestData = await req.json();

    if (!checkInDate || !checkOutDate || !hotelRoomSlug || !numberOfDays || !adults) {
        return new Response("Missing required fields", { status: 400 });
    }

    const origin = req.headers.get("origin");
    const session = await getServerSession(authOptions);

    if (!session) {
        return new Response("Unauthorized", { status: 400 });
    }

    const userId = session.user.id;
    const formattedCheckInDate = checkInDate.split("T")[0];
    const formattedCheckOutDate = checkOutDate.split("T")[0];

    try {
        const room = await getRoom(hotelRoomSlug);
        const discount = room.price - (room.price / 100) * room.discount;
        const totalPrice = discount * numberOfDays;

        const stripeSession = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: [
                {
                    quantity: 1,
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: room.name,
                            images: room.images.map((image) => image.url),
                        },
                        unit_amount: parseInt((totalPrice * 100).toString()),
                    },
                },
            ],
            payment_method_types: ["card", "blik", "p24"],
            success_url: `${origin}/users/${userId}`,
            metadata: {
                checkInDate: formattedCheckInDate,
                checkOutDate: formattedCheckOutDate,
                adults,
                children,
                hotelRoom: room._id,
                numberOfDays,
                user: userId,
                discount: room.discount,
                totalPrice: totalPrice.toString(),
            },
        });

        return NextResponse.json(stripeSession, {
            status: 200,
            statusText: "Success",
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error creating checkout session:", error);
        return new NextResponse(error, { status: 500 });
    }
}
