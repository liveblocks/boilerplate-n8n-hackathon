import { getUsers } from "../../database";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getUsers(), { status: 200 });
}
