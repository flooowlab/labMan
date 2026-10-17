/**
 * src/lib/search.ts
 * lunr.js catalog index builder.
 * Input:  array of public-safe item fields
 * Output: serialized lunr index (JSON-serializable object)
 */
import lunr from 'lunr';
import type { Item } from './types.js';

export interface CatalogDoc {
  id: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  sku: string;
  photo_url: string | null;
  official_page_url: string | null;
}

/** Convert a list of items to the public catalog doc shape (no PII). */
export function toCatalogDocs(items: Item[]): CatalogDoc[] {
  return items
    .filter((i) => !i.deleted_at)
    .map((i) => ({
      id: i.id,
      name: i.name ?? '',
      category: i.category ?? '',
      brand: i.brand ?? '',
      model: i.model ?? '',
      sku: i.sku ?? '',
      photo_url: i.photo_url ?? null,
      official_page_url: i.official_page_url ?? null,
    }));
}

/**
 * Build a serialized lunr index from catalog docs.
 * The serialized object can be passed as a prop to CatalogSearch.tsx.
 */
export function buildCatalogIndex(docs: CatalogDoc[]): object {
  const idx = lunr(function () {
    this.ref('id');
    this.field('name', { boost: 10 });
    this.field('category', { boost: 5 });
    this.field('brand', { boost: 3 });
    this.field('model', { boost: 3 });
    this.field('sku', { boost: 2 });
    docs.forEach((d) => this.add(d));
  });
  return idx.toJSON();
}
