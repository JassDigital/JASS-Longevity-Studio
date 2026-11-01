import { NextResponse } from "next/server";
import { db } from "@/lib/db";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const today=()=>new Date().toISOString().slice(0,10);
export async function GET(request:Request){
 const u=new URL(request.url), type=u.searchParams.get("type")||"summary";
 if(type==="goals") return NextResponse.json({items:db.prepare("SELECT * FROM goals ORDER BY id DESC").all()});
 if(type==="journal") return NextResponse.json({items:db.prepare("SELECT * FROM journal_entries ORDER BY entry_date DESC,id DESC LIMIT 100").all()});
 if(type==="wellness") return NextResponse.json({items:db.prepare("SELECT * FROM wellness_logs ORDER BY log_date DESC,id DESC LIMIT 200").all()});
 if(type==="summary"){
  const habits=db.prepare("SELECT COUNT(*) AS n FROM habit_logs WHERE completed=1 AND log_date=?").get(today()) as {n:number};
  const goals=db.prepare("SELECT COUNT(*) AS n FROM goals WHERE status='active'").get() as {n:number};
  const journal=db.prepare("SELECT COUNT(*) AS n FROM journal_entries").get() as {n:number};
  const research=db.prepare("SELECT COUNT(*) AS n FROM research_items").get() as {n:number};
  return NextResponse.json({date:today(),completedHabits:habits.n,activeGoals:goals.n,journalEntries:journal.n,researchItems:research.n});
 }
 return NextResponse.json({error:"Unknown resource type."},{status:400});
}
export async function POST(request:Request){
 const b=await request.json(), type=String(b.type||"");
 if(type==="goal"){
  const title=String(b.title||"").trim().slice(0,160), category=String(b.category||"General").slice(0,60), target=String(b.target||"").slice(0,160);
  if(!title) return NextResponse.json({error:"Goal title is required."},{status:400});
  const result=db.prepare("INSERT INTO goals(title,category,target) VALUES(?,?,?)").run(title,category,target);
  return NextResponse.json({ok:true,id:result.lastInsertRowid});
 }
 if(type==="goal-status"){
  const id=Number(b.id), status=String(b.status||"active");
  if(!Number.isInteger(id)||!["active","completed","paused"].includes(status)) return NextResponse.json({error:"Invalid goal update."},{status:400});
  db.prepare("UPDATE goals SET status=? WHERE id=?").run(status,id);
  return NextResponse.json({ok:true});
 }
 if(type==="journal"){
  const body=String(b.body||"").trim().slice(0,10000), title=String(b.title||"").trim().slice(0,160);
  const entryDate=String(b.date||today()).slice(0,10), mood=String(b.mood||"").slice(0,40);
  if(!body||!/^\d{4}-\d{2}-\d{2}$/.test(entryDate)) return NextResponse.json({error:"A journal note and valid date are required."},{status:400});
  const result=db.prepare("INSERT INTO journal_entries(entry_date,mood,title,body) VALUES(?,?,?,?)").run(entryDate,mood,title,body);
  return NextResponse.json({ok:true,id:result.lastInsertRowid});
 }
 if(type==="wellness"){
  const kind=String(b.kind||"").slice(0,40), value=Number(b.value), unit=String(b.unit||"").slice(0,20), note=String(b.note||"").slice(0,300), logDate=String(b.date||today()).slice(0,10);
  if(!kind||!Number.isFinite(value)||value<0||value>100000||!/^\d{4}-\d{2}-\d{2}$/.test(logDate)) return NextResponse.json({error:"Invalid wellness entry."},{status:400});
  db.prepare("INSERT INTO wellness_logs(log_date,kind,value,unit,note) VALUES(?,?,?,?,?)").run(logDate,kind,value,unit,note);
  return NextResponse.json({ok:true});
 }
 return NextResponse.json({error:"Unknown operation."},{status:400});
}
