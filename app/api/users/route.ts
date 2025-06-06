import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/libs/auth";
import { checkReviewExist, createReview, getUserData, updateReview } from "@/app/libs/apis";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new NextResponse("Authentication Required", { status: 500 });
    }

    const userId = session.user.id;

    try {
        const data = await getUserData(userId);
        return NextResponse.json(data, { status: 200, statusText: "Successful" });
    } catch (error) {
        console.log("error", error);
        return new NextResponse(`Unable to fetch`, { status: 400 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new NextResponse("Authentication Required", { status: 500 });
    }

    const userId = session.user.id;

    const { roomId, reviewText, ratingValue } = await req.json();
    if (!roomId || !reviewText || !ratingValue) {
        return new NextResponse("All fields are required", { status: 400 });
    }
    try {
        const reviewExist = await checkReviewExist(userId, roomId);
        let data;
        if (reviewExist) {
            data = await updateReview({
                reviewId: reviewExist._id,
                reviewText,
                userRating: ratingValue,
            });
        } else {
            data = await createReview({
                hotelRoomId: roomId,
                reviewText,
                userRating: ratingValue,
                userId,
            });
        }
        return NextResponse.json(data, { status: 200, statusText: "Successful" });
    } catch (error) {
        console.log("error", error);
        return new NextResponse("Unable to create review", { status: 400 });
    }
}
