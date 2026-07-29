import { NextResponse } from "next/server";
import { auth } from "@/lib/temp-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.role !== "ADMIN") return new NextResponse("Forbidden", { status: 403 });

    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 50, // Limit for now
    });

    return NextResponse.json(users);
}
