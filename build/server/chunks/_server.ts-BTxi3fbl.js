import { join } from 'path';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { w as withAuth } from './middleware-ngQf4GKt.js';
import { a as readDb } from './db-CfhGAyvN.js';
import './auth-ByWUbuPz.js';
import 'jose';
import 'crypto';
import 'proper-lockfile';

const DATA_DIR = process.env.DATA_DIR ?? "./src/data";
const GET = async (event) => {
  const { params } = event;
  const items = readDb(params.labId, "items.json");
  const item = items.find((i) => i.id === params.id);
  if (!item || !item.image_path) return new Response("Not found", { status: 404 });
  const imgPath = join(DATA_DIR, "..", "..", "data", params.labId, "assets", params.id, item.image_path);
  if (!existsSync(imgPath)) return new Response("Not found", { status: 404 });
  const buf = await readFile(imgPath);
  const ext = item.image_path.split(".").pop()?.toLowerCase() ?? "jpg";
  const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
  return new Response(buf, { headers: { "Content-Type": mime, "Cache-Control": "public, max-age=86400" } });
};
const POST = (event) => withAuth(event, { minRole: "manager" });

export { GET, POST };
//# sourceMappingURL=_server.ts-BTxi3fbl.js.map
