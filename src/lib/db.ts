import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const dbPath = process.env.DATABASE_PATH || path.join(dataDir, "longevity.sqlite");
const globalForDb = globalThis as unknown as { longevityDb?: Database.Database };
export const db = globalForDb.longevityDb ?? new Database(dbPath);
if (process.env.NODE_ENV !== "production") globalForDb.longevityDb = db;
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
db.pragma("busy_timeout = 5000");

db.exec(`
CREATE TABLE IF NOT EXISTS research_items (
 id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT NOT NULL UNIQUE, title TEXT NOT NULL,
 category TEXT NOT NULL, summary TEXT NOT NULL, evidence_level TEXT NOT NULL,
 study_type TEXT NOT NULL, population TEXT NOT NULL, limitations TEXT NOT NULL,
 source_name TEXT NOT NULL, source_url TEXT NOT NULL, published_year INTEGER NOT NULL,
 doi TEXT, pmid TEXT, sample_size TEXT, review_status TEXT NOT NULL DEFAULT 'starter',
 last_reviewed TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE VIRTUAL TABLE IF NOT EXISTS research_search USING fts5(
 title, category, summary, content='research_items', content_rowid='id'
);
DROP TRIGGER IF EXISTS research_items_ai;
DROP TRIGGER IF EXISTS research_items_ad;
DROP TRIGGER IF EXISTS research_items_au;
CREATE TRIGGER research_items_ai AFTER INSERT ON research_items BEGIN
 INSERT INTO research_search(rowid,title,category,summary) VALUES(new.id,new.title,new.category,new.summary);
END;
CREATE TRIGGER research_items_ad AFTER DELETE ON research_items BEGIN
 INSERT INTO research_search(research_search,rowid,title,category,summary)
 VALUES('delete',old.id,old.title,old.category,old.summary);
END;
CREATE TRIGGER research_items_au AFTER UPDATE ON research_items BEGIN
 INSERT INTO research_search(research_search,rowid,title,category,summary)
 VALUES('delete',old.id,old.title,old.category,old.summary);
 INSERT INTO research_search(rowid,title,category,summary) VALUES(new.id,new.title,new.category,new.summary);
END;
CREATE TABLE IF NOT EXISTS habit_logs (
 id INTEGER PRIMARY KEY AUTOINCREMENT, habit_key TEXT NOT NULL, habit_label TEXT NOT NULL,
 log_date TEXT NOT NULL, completed INTEGER NOT NULL DEFAULT 0,
 UNIQUE(habit_key,log_date)
);
CREATE TABLE IF NOT EXISTS goals (
 id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, category TEXT NOT NULL,
 target TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'active',
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS journal_entries (
 id INTEGER PRIMARY KEY AUTOINCREMENT, entry_date TEXT NOT NULL, mood TEXT NOT NULL DEFAULT '',
 title TEXT NOT NULL DEFAULT '', body TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS wellness_logs (
 id INTEGER PRIMARY KEY AUTOINCREMENT, log_date TEXT NOT NULL, kind TEXT NOT NULL,
 value REAL, unit TEXT NOT NULL DEFAULT '', note TEXT NOT NULL DEFAULT '',
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS app_settings (
 setting_key TEXT PRIMARY KEY, setting_value TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS assistant_messages (
 id INTEGER PRIMARY KEY AUTOINCREMENT, role TEXT NOT NULL, content TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`);


// Backward-compatible additive migrations for databases created by v0.1.x.
const researchColumns = db.prepare("PRAGMA table_info(research_items)").all() as {name:string}[];
const knownColumns = new Set(researchColumns.map(c=>c.name));
const additiveColumns: Record<string,string> = {
 doi:"TEXT", pmid:"TEXT", sample_size:"TEXT",
 review_status:"TEXT NOT NULL DEFAULT 'starter'", last_reviewed:"TEXT"
};
for (const [name, definition] of Object.entries(additiveColumns)) {
 if (!knownColumns.has(name)) db.exec(`ALTER TABLE research_items ADD COLUMN ${name} ${definition}`);
}

const initial = [
["physical-activity-and-health","Physical activity and healthy ageing","Movement","Regular physical activity supports cardiovascular health, physical function and wellbeing. A balanced programme can include aerobic activity, strength work and balance training.","Strong public-health consensus","Guidelines and evidence synthesis","Adults across the lifespan","Individual needs vary; people with symptoms or relevant conditions may need tailored professional advice.","World Health Organization","https://www.who.int/news-room/fact-sheets/detail/physical-activity",2024],
["strength-after-50","Strength training across adulthood","Exercise","Resistance exercise can help maintain muscle strength and functional capacity as people age. Progression should match ability and experience.","Moderate to strong","Systematic reviews and trials","Adults, including older adults","Effects depend on programme design, adherence and baseline function. This summary is educational, not an individual prescription.","National Institute on Aging","https://www.nia.nih.gov/health/exercise-and-physical-activity",2023],
["sleep-and-health","Sleep duration and overall health","Sleep","Adequate, regular sleep is associated with better health and day-to-day functioning. Sleep needs and sleep quality should be considered together.","Strong consensus; specific effects vary","Guideline and evidence synthesis","Adults","Sleep duration alone does not capture sleep disorders or individual variation. Persistent sleep problems warrant professional assessment.","CDC","https://www.cdc.gov/sleep/about/index.html",2024],
["healthy-diet-patterns","Healthy dietary patterns","Nutrition","Dietary patterns emphasizing vegetables, fruits, legumes, whole grains, nuts and appropriate protein sources are widely recommended for general health.","Strong public-health consensus","Guidelines and evidence synthesis","Adults","Specific dietary needs vary by health status, culture, access and preferences. Avoid interpreting single foods as cures.","World Health Organization","https://www.who.int/news-room/fact-sheets/detail/healthy-diet",2024],
["social-connection","Social connection and wellbeing","Brain health","Social connection is an important dimension of wellbeing. Research links social relationships with several health outcomes, though observational associations do not prove causation.","Moderate; largely observational","Observational research and evidence synthesis","Adults across the lifespan","Confounding and reverse causation are possible. The evidence does not establish a guaranteed lifespan effect.","U.S. Surgeon General","https://www.hhs.gov/surgeongeneral/priorities/connection/index.html",2023],
["balance-and-falls","Balance activity and falls prevention","Healthy ageing","Balance and functional exercise are commonly included in falls-prevention approaches for older adults.","Moderate to strong for selected programmes","Clinical trials and evidence synthesis","Older adults","Appropriate activities depend on balance, mobility and fall history. Seek qualified guidance when fall risk is high.","National Institute on Aging","https://www.nia.nih.gov/health/exercise-and-physical-activity",2023],
["healthy-diet","Healthy diet: key facts","Nutrition","A healthy dietary pattern includes variety, balance and moderation, with emphasis on minimally processed foods and adequate fruit and vegetables.","Strong public-health consensus","Public-health guidance","Adults and children","Dietary requirements differ by age, health status, culture and food access.","World Health Organization","https://www.who.int/news-room/fact-sheets/detail/healthy-diet",2024],
["tobacco-health","Tobacco and health risks","Lifestyle","Tobacco use is harmful to health. Avoiding tobacco and seeking evidence-based cessation support can improve health outcomes.","Strong consensus","Public-health evidence synthesis","All age groups","This record is general education; cessation support should be tailored with qualified services when needed.","World Health Organization","https://www.who.int/news-room/fact-sheets/detail/tobacco",2024],
["older-adult-activity","Physical activity for older adults","Healthy ageing","Physical activity supports mobility, functional ability and general health in older adulthood. Activity can be adapted to individual capacity.","Strong public-health consensus","Guidelines and evidence synthesis","Older adults","People with chronic conditions, pain, dizziness or fall concerns may need adapted advice from a qualified professional.","WHO","https://www.who.int/news-room/fact-sheets/detail/physical-activity",2024],
["mental-wellbeing","Mental wellbeing and healthy routines","Lifestyle","Regular routines, supportive relationships, meaningful activity and seeking help when needed can contribute to mental wellbeing.","Broad public-health consensus","Public-health guidance","Adults","Wellbeing advice is not a substitute for assessment or treatment of mental health concerns.","WHO","https://www.who.int/health-topics/mental-health",2024]
];
const count = (db.prepare("SELECT COUNT(*) AS count FROM research_items").get() as {count:number}).count;
if (!count) {
 const insert=db.prepare(`INSERT INTO research_items
 (slug,title,category,summary,evidence_level,study_type,population,limitations,source_name,source_url,published_year)
 VALUES(?,?,?,?,?,?,?,?,?,?,?)`);
 const tx=db.transaction((items: typeof initial)=>{for(const item of items) insert.run(...item);});
 tx(initial);
}
