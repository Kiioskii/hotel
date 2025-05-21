import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const roomId = params.id;

    try {
    } catch (error) {
        console.log("error", error);
        return new NextResponse("Error fetching room reviews", { status: 500 });
    }
}
