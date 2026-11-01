import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = db.prepare("SELECT COUNT(*) AS count FROM research_items").get() as { count: number };
    return NextResponse.json({
      status: "ok",
      application: "JASS Longevity Studio",
      release: "1.0.0",
      database: "connected",
      researchRecords: result.count
    });
  } catch {
    return NextResponse.json({ status: "error", database: "unavailable" }, { status: 503 });
  }
}
