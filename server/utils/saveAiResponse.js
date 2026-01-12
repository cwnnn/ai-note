import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data/aiResponses.json");

// Dosya yoksa oluştur
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify([]));
}

export function saveAiResponse(note, response, status = "success") {
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  data.push({
    timestamp: new Date().toISOString(),
    note,
    status, // success / fail
    response, // AI'dan gelen ham veri (JSON veya text)
  });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
