import { getRoomReviews } from "@/app/libs/apis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id: roomId } = await params;

    if (!roomId) {
        return new NextResponse("Room ID is required", { status: 400 });
    }
    try {
        const roomReviews = await getRoomReviews(roomId);
        return NextResponse.json(roomReviews, { status: 200 });
    } catch (error) {
        console.error("Error fetching room reviews:", error);
        return new NextResponse("Error fetching room reviews", { status: 500 });
    }
}
