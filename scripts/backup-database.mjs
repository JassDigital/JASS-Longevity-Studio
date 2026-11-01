import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
const source=process.env.DATABASE_PATH || path.join(process.cwd(),"data","longevity.sqlite");
if(!fs.existsSync(source)){console.error(`Database not found: ${source}`);process.exit(1);}
const backupDir=path.join(process.cwd(),"backups");
fs.mkdirSync(backupDir,{recursive:true});
const stamp=new Date().toISOString().replace(/[:.]/g,"-");
const destination=path.join(backupDir,`longevity-${stamp}.sqlite`);
const db=new Database(source,{readonly:true,fileMustExist:true});
try {
 await db.backup(destination);
 console.log(`Consistent SQLite backup created: ${destination}`);
} finally { db.close(); }
