import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/libs/auth";
import { getUserData } from "@/app/libs/apis";

export async function GET(req: Request, res: Response) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  try {
    const userData = await getUserData(userId);
    return NextResponse.json(userData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching user data" },
      { status: 400 }
    );
  }
}
