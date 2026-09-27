import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { articles, getArticle, getTopic, jsonLd, siteUrl, telegramHref } from '@/lib/knowledge';
import styles from '../styles.module.css';

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return articles.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticle((await params).slug);
  if (!article) notFound();
  const url = `${siteUrl}/knowledge/${article.slug}`;
  return {
    title: { absolute: `${article.title} — ОПТ МЕБЕЛЬ ЮГ` },
    description: article.description,
    alternates: { canonical: url },
    openGraph: { title: article.title, description: article.description, url, type: 'article', locale: 'ru_RU', modifiedTime: article.updatedAt },
  };
}
export default async function ArticlePage({ params }: Props) {
  const article = getArticle((await params).slug);
  if (!article) notFound();
  const url = `${siteUrl}/knowledge/${article.slug}`;
  const schema = {
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'Article', headline: article.title, description: article.description, dateModified: article.updatedAt,
        author: { '@type': 'Organization', name: 'ОПТ МЕБЕЛЬ ЮГ', url: siteUrl }, mainEntityOfPage: url },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'База знаний', item: `${siteUrl}/knowledge` },
        { '@type': 'ListItem', position: 3, name: article.title, item: url },
      ] },
    ],
  };
  return <main className={styles.page}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
    <nav className={styles.nav} aria-label="Навигация"><Link href="/">ОПТ МЕБЕЛЬ ЮГ</Link><Link href="/knowledge">← Все материалы</Link></nav>
    <article className={styles.article}>
      <header className={styles.articleHero}>
        <p className={styles.eyebrow}>{getTopic(article.slug)?.clusterTitle}</p>
        <h1>{article.title}</h1>
        <p className={styles.intro}>{article.intro}</p>
        <p className={styles.meta}>Редакция ОПТ МЕБЕЛЬ ЮГ · Обновлено <time dateTime={article.updatedAt}>{article.updatedAt.split('-').reverse().join('.')}</time></p>
      </header>
      <nav className={styles.contents} aria-label="Содержание"><strong>В этом материале</strong><ol>{article.sections.map((section, i) => <li key={section.heading}><a href={`#section-${i + 1}`}>{section.heading}</a></li>)}</ol></nav>
      {article.sections.map((section, i) => <section className={styles.section} id={`section-${i + 1}`} key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}
      <section className={styles.checklist}><h2>Чек-лист перед обращением</h2><ul>{article.checklist.map((item) => <li key={item}>{item}</li>)}</ul></section>
      <aside className={styles.cta}><p className={styles.eyebrow}>ОБСУДИМ ВАШУ ПАРТИЮ</p><h2>Перейдём к вашему изделию</h2><p>Подготовьте референс, объём, точку поставки и сроки. В Telegram можно запросить прайс и обсудить задачу.</p><a className={styles.button} href={telegramHref}>Получить прайс в Telegram ↗</a><p className={styles.meta}>ЮЛ/ИП · заказ от 300 000 ₽</p></aside>
      <p className={styles.meta}>Условия компании: <a href={article.sourceUrl}>официальный сайт</a>. Материал помогает подготовить запрос; расчёт и сроки согласуются индивидуально.</p>
      <section className={styles.section}><h2>По теме</h2><ul>{article.related.map((slug) => { const related = getArticle(slug); return related ? <li key={slug}><Link href={`/knowledge/${slug}`}>{related.title}</Link></li> : null; })}</ul></section>
    </article>
    <footer className={styles.footer}><Link href="/knowledge">← База знаний</Link><Link href="/">Производство и условия →</Link></footer>
  </main>;
}
