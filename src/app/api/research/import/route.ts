import { NextResponse } from "next/server";
import { db } from "@/lib/db";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request:Request){
 const body=await request.json(), items=Array.isArray(body.items)?body.items:[];
 if(!items.length||items.length>500) return NextResponse.json({error:"Provide between 1 and 500 research records."},{status:400});
 const insert=db.prepare(`INSERT INTO research_items
 (slug,title,category,summary,evidence_level,study_type,population,limitations,source_name,source_url,published_year,doi,pmid,sample_size,review_status,last_reviewed)
 VALUES(@slug,@title,@category,@summary,@evidence_level,@study_type,@population,@limitations,@source_name,@source_url,@published_year,@doi,@pmid,@sample_size,@review_status,@last_reviewed)
 ON CONFLICT(slug) DO UPDATE SET title=excluded.title,category=excluded.category,summary=excluded.summary,
 evidence_level=excluded.evidence_level,study_type=excluded.study_type,population=excluded.population,
 limitations=excluded.limitations,source_name=excluded.source_name,source_url=excluded.source_url,
 published_year=excluded.published_year,doi=excluded.doi,pmid=excluded.pmid,sample_size=excluded.sample_size,
 review_status=excluded.review_status,last_reviewed=excluded.last_reviewed`);
 let imported=0;
 const tx=db.transaction((records:Record<string,unknown>[])=>{
  for(const x of records){
   const title=String(x.title||"").trim(), slug=String(x.slug||title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")).slice(0,180);
   const url=String(x.source_url||"");
   if(!title||!slug||!/^https?:\/\//i.test(url)) continue;
   const year=Number(x.published_year)||new Date().getFullYear();
   insert.run({slug,title:title.slice(0,300),category:String(x.category||"General").slice(0,80),
    summary:String(x.summary||"").slice(0,5000),evidence_level:String(x.evidence_level||"Not assessed").slice(0,160),
    study_type:String(x.study_type||"Not specified").slice(0,160),population:String(x.population||"Not specified").slice(0,300),
    limitations:String(x.limitations||"Not assessed").slice(0,3000),source_name:String(x.source_name||"Source not specified").slice(0,200),
    source_url:url.slice(0,1000),published_year:Math.max(1900,Math.min(2100,year)),doi:String(x.doi||"").slice(0,150),
    pmid:String(x.pmid||"").slice(0,80),sample_size:String(x.sample_size||"").slice(0,100),
    review_status:String(x.review_status||"imported").slice(0,40),last_reviewed:String(x.last_reviewed||"").slice(0,30)});
   imported++;
  }
 });
 tx(items);
 return NextResponse.json({ok:true,imported,received:items.length});
}
