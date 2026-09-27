import data from '@/content/articles.json';
import topics from '@/content/topics.json';

export const siteUrl = 'https://www.optmebelug.ru';
export const articles = data.filter((article) => article.status === 'ready');
export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}
export function getTopic(slug: string) {
  return topics.find((topic) => topic.slug === slug);
}
export function telegramHref(slug: string) {
  const topic = getTopic(slug);
  if (!topic) throw new Error(`Unknown knowledge topic: ${slug}`);
  return `https://t.me/OptMebelUg_GivMyPR_Bot?start=seo_${topic.id}`;
}
export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
