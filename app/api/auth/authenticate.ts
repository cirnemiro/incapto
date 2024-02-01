import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
    const body = await req.json();
    return NextResponse.json({ error: `${body}` }, { status: 200 })
}