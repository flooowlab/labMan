import { join } from 'path';
import { createReadStream, existsSync } from 'fs';
import { readFile } from 'fs/promises';
import type { RequestHandler } from '@sveltejs/kit';
import { withAuth } from '$lib/middleware.js';
import { readDb, commit } from '$lib/db.js';
import type { Item } from '$lib/types.js';

const DATA_DIR = process.env.DATA_DIR ?? './src/data';

// Serve item image
export const GET: RequestHandler = async (event) => {
  const { params } = event;
  const items = readDb<Item>(params.labId, 'items.json');
  const item = items.find((i) => i.id === params.id);
  if (!item || !item.image_path) return new Response('Not found', { status: 404 });

  const imgPath = join(DATA_DIR, '..', '..', 'data', params.labId, 'assets', params.id, item.image_path);
  if (!existsSync(imgPath)) return new Response('Not found', { status: 404 });

  const buf = await readFile(imgPath);
  const ext = item.image_path.split('.').pop()?.toLowerCase() ?? 'jpg';
  const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
  return new Response(buf, { headers: { 'Content-Type': mime, 'Cache-Control': 'public, max-age=86400' } });
};

// Upload item image (manager+)
export const POST: RequestHandler = (event) =>
  withAuth(event, { minRole: 'manager' }, async (event) => {
    const { params } = event;
    const items = readDb<Item>(params.labId, 'items.json');
    const item = items.find((i) => i.id === params.id && !i.deleted_at);
    if (!item) return new Response(JSON.stringify({ error: 'Item not found' }), { status: 404 });

    const formData = await event.request.formData();
    const file = formData.get('image') as File | null;
    if (!file || !(file instanceof File)) return new Response(JSON.stringify({ error: 'No image provided' }), { status: 400 });

    if (file.size > 5 * 1024 * 1024) return new Response(JSON.stringify({ error: 'Image too large (max 5 MB)' }), { status: 400 });

    // Validate MIME type from content
    const buf = Buffer.from(await file.arrayBuffer());
    let mime = '';
    let ext = '';
    if (buf[0] === 0xFF && buf[1] === 0xD8) { mime = 'image/jpeg'; ext = 'jpg'; }
    else if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) { mime = 'image/png'; ext = 'png'; }
    else if (buf.slice(0,4).toString() === 'RIFF' && buf.slice(8,12).toString() === 'WEBP') { mime = 'image/webp'; ext = 'webp'; }
    if (!mime) return new Response(JSON.stringify({ error: 'Invalid image format (JPEG, PNG, or WebP required)' }), { status: 400 });

    const { randomUUID } = await import('crypto');
    const filename = `${randomUUID()}.${ext}`;
    const dir = join(DATA_DIR, '..', '..', 'data', params.labId, 'assets', params.id);
    const { mkdir, writeFile } = await import('fs/promises');
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, filename), buf);

    await commit(params.labId, 'items.json', items.map((i) => i.id === params.id ? { ...i, image_path: filename } : i));

    return new Response(JSON.stringify({ ok: true, image_path: filename }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  });
