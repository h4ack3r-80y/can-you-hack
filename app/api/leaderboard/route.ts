import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/points";

export async function GET() {
  const board = await getLeaderboard(25);
  return NextResponse.json({ board });
}
