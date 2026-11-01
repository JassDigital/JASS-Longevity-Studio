import { NextResponse } from "next/server";
import { db } from "@/lib/db";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(){
 const backup={
  application:"JASS Longevity Studio",formatVersion:1,createdAt:new Date().toISOString(),
  notice:"Contains personal journal and wellbeing data. Keep this backup private.",
  research:db.prepare("SELECT * FROM research_items ORDER BY id").all(),
  habits:db.prepare("SELECT * FROM habit_logs ORDER BY log_date,id").all(),
  goals:db.prepare("SELECT * FROM goals ORDER BY id").all(),
  journal:db.prepare("SELECT * FROM journal_entries ORDER BY entry_date,id").all(),
  wellness:db.prepare("SELECT * FROM wellness_logs ORDER BY log_date,id").all()
 };
 return new NextResponse(JSON.stringify(backup,null,2),{headers:{
  "Content-Type":"application/json; charset=utf-8",
  "Content-Disposition":"attachment; filename=jass-longevity-studio-backup.json",
  "Cache-Control":"no-store"
 }});
}
