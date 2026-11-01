import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim();
  const category = (searchParams.get("category") || "").trim();
  let rows;
  if (query) {
    const safe = query.replace(/[^\p{L}\p{N}\s_-]/gu, " ").trim();
    if (!safe) rows = db.prepare("SELECT * FROM research_items ORDER BY published_year DESC").all();
    else rows = db.prepare(`SELECT r.* FROM research_items r
      JOIN research_search s ON s.rowid = r.id
      WHERE research_search MATCH ? ${category ? "AND r.category = ?" : ""}
      ORDER BY r.published_year DESC LIMIT 100`)
      .all(safe.split(/\s+/).filter(Boolean).map(x => `"${x}"`).join(" OR ") + "*", ...(category ? [category] : []));
  } else if (category) {
    rows = db.prepare("SELECT * FROM research_items WHERE category = ? ORDER BY published_year DESC").all(category);
  } else {
    rows = db.prepare("SELECT * FROM research_items ORDER BY published_year DESC").all();
  }
  return NextResponse.json({ items: rows });
}
