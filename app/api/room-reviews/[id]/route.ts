import { getRoomReviews } from "@/app/libs/apis";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const roomId = params.id;

    try {
        const roomReviews = await getRoomReviews(roomId);
        return NextResponse.json(roomReviews, { status: 200 });
    } catch (error) {
        console.log("error", error);
        return new NextResponse("Error fetching room reviews", { status: 500 });
    }
}
