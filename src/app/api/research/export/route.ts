import { NextResponse } from "next/server";
import { db } from "@/lib/db";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(request:Request){
 const format=new URL(request.url).searchParams.get("format")||"json";
 const rows=db.prepare("SELECT slug,title,category,summary,evidence_level,study_type,population,limitations,source_name,source_url,published_year,doi,pmid,sample_size,review_status,last_reviewed FROM research_items ORDER BY category,title").all() as Record<string,unknown>[];
 if(format==="csv"){
  const keys=Object.keys(rows[0]||{});
  const esc=(v:unknown)=>`"${String(v??"").replace(/"/g,'""')}"`;
  const csv=[keys.map(esc).join(","),...rows.map(r=>keys.map(k=>esc(r[k])).join(","))].join("\r\n");
  return new NextResponse(csv,{headers:{"Content-Type":"text/csv; charset=utf-8","Content-Disposition":"attachment; filename=jass-research-library.csv"}});
 }
 return NextResponse.json({exportedAt:new Date().toISOString(),count:rows.length,items:rows});
}
