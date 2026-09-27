import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const root = new URL('../', import.meta.url);
const articles = JSON.parse(readFileSync(new URL('content/articles.json', root), 'utf8'));
const topics = JSON.parse(readFileSync(new URL('content/topics.json', root), 'utf8'));
assert.equal(topics.length, 25);
for (const key of ['id', 'slug']) assert.equal(new Set(topics.map(t => t[key])).size, topics.length, `Повтор ${key}`);
assert.equal(new Set(articles.map(a => a.slug)).size, articles.length);
for (const t of topics) {
  assert.match(t.id, /^kb\d{2}$/);
  assert.match(t.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.match(`seo_${t.id}`, /^[A-Za-z0-9_-]{1,64}$/);
}
for (const a of articles) {
  assert.ok(['ready','draft'].includes(a.status));
  assert.ok(topics.some(t => t.slug === a.slug));
  assert.ok(a.title && a.description && a.intro && a.sourceUrl);
  assert.match(a.updatedAt, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(Number.isFinite(Date.parse(a.updatedAt)));
  assert.ok(a.sections.length >= 3 && a.checklist.length >= 4);
  for (const s of a.sections) assert.ok(s.heading && s.paragraphs.length > 0 && s.paragraphs.every(p => typeof p === 'string' && p.length > 0));
  for (const slug of a.related) assert.ok(articles.some(other => other.slug === slug && other.status === 'ready'), `Битая ссылка ${slug}`);
}
console.log(`OK: ${topics.length} тем; ${articles.length} статей; уникальные адреса; ссылки; обязательные поля; Telegram payload.`);
