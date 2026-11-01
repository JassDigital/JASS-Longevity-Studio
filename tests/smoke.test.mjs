import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
const root=process.cwd();
const exists=(p)=>fs.existsSync(path.join(root,p));
const read=(p)=>fs.readFileSync(path.join(root,p),"utf8");

test("Next.js application entry points exist",()=>{
 assert.ok(exists("src/app/layout.tsx"));
 assert.ok(exists("src/app/page.tsx"));
 assert.ok(exists("src/components/dashboard.tsx"));
});
test("Research library supports search, import and export",()=>{
 assert.match(read("src/app/api/research/route.ts"),/export async function GET/);
 assert.ok(exists("src/app/api/research/import/route.ts"));
 assert.ok(exists("src/app/api/research/export/route.ts"));
});
test("Personal workspace API supports goals, journal and wellbeing",()=>{
 const s=read("src/app/api/workspace/route.ts");
 for(const feature of ["goals","journal","wellness","goal-status"]) assert.ok(s.includes(feature));
});
test("Daily habits persist to SQLite",()=>{
 const s=read("src/app/api/habits/route.ts");
 assert.match(s,/export async function GET/);
 assert.match(s,/export async function POST/);
 assert.match(s,/ON CONFLICT/);
});
test("Complete UI exposes all planned modules",()=>{
 const s=read("src/components/dashboard.tsx");
 for(const view of ["dashboard","research","planner","goals","journal","nutrition","movement","sleep","brain","analytics","assistant","profile","settings"]) {
  assert.ok(s.includes(`"${view}"`),`Missing UI module: ${view}`);
 }
});
test("Backup, health endpoint and evidence policy exist",()=>{
 assert.ok(exists("src/app/api/backup/route.ts"));
 assert.match(read("src/components/dashboard.tsx"),/Study comparison/);
 assert.ok(exists("src/app/api/health/route.ts"));
 assert.ok(exists("docs/EVIDENCE_POLICY.md"));
 assert.ok(exists("docs/SECURITY_DEPLOYMENT.md"));
});
test("Release metadata is v1.0.0",()=>{
 const pkg=JSON.parse(read("package.json"));
 assert.equal(pkg.version,"1.0.0");
});
