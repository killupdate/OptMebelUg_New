import type { Metadata } from 'next';
import Link from 'next/link';
import { articles, getTopic, siteUrl } from '@/lib/knowledge';
import styles from './styles.module.css';

export const metadata: Metadata = {
  title: { absolute: 'База знаний для мебельного бизнеса — ОПТ МЕБЕЛЬ ЮГ' },
  description: 'Практические материалы о производстве мебели под СТМ, оптовых заказах и подготовке поставок для маркетплейсов.',
  alternates: { canonical: `${siteUrl}/knowledge` },
};

export default function KnowledgePage() {
  return <main className={styles.page}>
    <nav className={styles.nav} aria-label="Навигация"><Link href="/">ОПТ МЕБЕЛЬ ЮГ</Link><span>База знаний</span></nav>
    <header className={styles.hero}>
      <p className={styles.eyebrow}>ПРОИЗВОДСТВО · ОПТ · СТМ</p>
      <h1>От идеи изделия<br />к готовой партии</h1>
      <p>Что подготовить, проверить и согласовать, когда вы заказываете мебель для своего бизнеса.</p>
    </header>
    <section className={styles.grid} aria-label="Материалы для бизнеса">
      {articles.map((article, index) => <article key={article.slug} className={styles.card}>
        <span className={styles.number}>0{index + 1} / {getTopic(article.slug)?.clusterTitle}</span>
        <h2><Link href={`/knowledge/${article.slug}`}>{article.title}</Link></h2>
        <p>{article.description}</p>
        <Link className={styles.more} href={`/knowledge/${article.slug}`}>Читать материал →</Link>
      </article>)}
    </section>
    <aside className={styles.note}>Работаем с ЮЛ и ИП. Минимальный заказ — от 300 000 ₽. Условия и сроки подтверждаем после согласования задачи.</aside>
    <footer className={styles.footer}><Link href="/">На сайт производства →</Link></footer>
  </main>;
}
