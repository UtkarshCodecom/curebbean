// node scripts/convert-flows.mjs
import fs from "node:fs";
import path from "node:path";
import xlsx from "xlsx";

const SRC_XLSX = path.resolve("Curebbean_Symptom_Flow_Customized.xlsx"); // put the Excel in project root
const OUT_JSON = path.resolve("src/data/flows.json");

if (!fs.existsSync(SRC_XLSX)) {
  console.error("Excel not found at", SRC_XLSX);
  process.exit(1);
}

const wb = xlsx.readFile(SRC_XLSX);
const flows = [];

for (const sheetName of wb.SheetNames) {
  const rows = xlsx.utils.sheet_to_json(wb.Sheets[sheetName], { defval: "" });
  // Expect columns: Section | Details
  const map = {};
  for (const r of rows) {
    const k = String(r.Section || "").trim();
    if (!k) continue;
    map[k] = r.Details;
  }

  // collect Follow-up Question 1..N
  const questions = Object.keys(map)
    .filter((k) => /^follow[- ]?up question/i.test(k))
    .sort((a, b) => (a.match(/\d+/)?.[0] ?? 0) - (b.match(/\d+/)?.[0] ?? 0))
    .map((k) => String(map[k]).trim())
    .filter(Boolean);

  flows.push({
    disease: sheetName,
    questions, // array of strings; options are Yes/No/Not sure in UI
    redFlagText: String(map["Red Flag Trigger"] || "").trim(),
    redFlagGuidance: String(map["Red Flag Guidance"] || "").trim(),
    nonUrgentAdvice: String(map["Non-Urgent Advice"] || "").trim(),
    nonUrgentConditions: String(map["Non-Urgent Possible Conditions"] || "")
      .split(/\r?\n|;/).map(s => s.trim()).filter(Boolean),
    summary: String(map["AI Output Summary"] || "").trim(),
  });
}

fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.writeFileSync(OUT_JSON, JSON.stringify({ flows }, null, 2), "utf8");
console.log(`Wrote ${flows.length} flows → ${OUT_JSON}`);
