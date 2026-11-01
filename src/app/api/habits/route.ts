import { NextResponse } from "next/server";
import { db } from "@/lib/db";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const date = new URL(request.url).searchParams.get("date") || new Date().toISOString().slice(0,10);
  const rows = db.prepare("SELECT habit_key, habit_label, completed FROM habit_logs WHERE log_date = ?").all(date);
  return NextResponse.json({ date, items: rows });
}
export async function POST(request: Request) {
  const body = await request.json();
  const habitKey = String(body.habitKey || "").slice(0, 80);
  const habitLabel = String(body.habitLabel || "").slice(0, 120);
  const logDate = String(body.date || "").slice(0, 10);
  const completed = body.completed ? 1 : 0;
  if (!/^[a-z0-9_-]+$/i.test(habitKey) || !/^\d{4}-\d{2}-\d{2}$/.test(logDate) || !habitLabel) {
    return NextResponse.json({ error: "Invalid habit entry." }, { status: 400 });
  }
  db.prepare(`INSERT INTO habit_logs(habit_key,habit_label,log_date,completed)
    VALUES(?,?,?,?) ON CONFLICT(habit_key,log_date)
    DO UPDATE SET habit_label=excluded.habit_label, completed=excluded.completed`)
    .run(habitKey, habitLabel, logDate, completed);
  return NextResponse.json({ ok: true });
}
