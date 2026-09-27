import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const topics = JSON.parse(readFileSync(`${root}/content/topics.json`, 'utf8'));
const articles = JSON.parse(readFileSync(`${root}/content/articles.json`, 'utf8'));
const requested = process.argv[2];
const topic = requested ? topics.find(t => t.id === requested) : topics.find(t => !articles.some(a => a.slug === t.slug) && !existsSync(`${root}/drafts/${t.id}.md`));
if (!topic) throw new Error('Нет подходящей темы. Передайте существующий ID, например kb04.');
mkdirSync(`${root}/drafts`, { recursive: true });
const prompt = `# Задание для Codex: ${topic.question}

Тема: ${topic.id}; группа: ${topic.clusterTitle}; адрес: /knowledge/${topic.slug}.
Статус: черновик. Спрос пока не проверен.

Подготовь полезную статью для B2B-заказчика ОПТ МЕБЕЛЬ ЮГ по структуре content/articles.json.
Сначала прочитай существующие статьи и исключи дублирование. Проверь актуальные условия на https://www.optmebelug.ru/.
Читатель: ЮЛ/ИП, мебельный магазин, оптовик, селлер или владелец СТМ.
Дай прямой ответ, последовательность действий, конкретный пример и чек-лист.
Не выдумывай цены, сроки, мощности, сертификаты, клиентов или гарантии результата.
Укажи источники и отдельно перечисли вопросы, на которые нужен ответ производства.
Технические требования маркетплейсов сверяй с официальными источниками.
Предложи description и ссылки на две существующие статьи.
Призыв: запросить прайс или обсудить партию в @OptMebelUg_GivMyPR_Bot.
Сохрани результат в drafts/${topic.id}.json, status=draft. Не меняй status на ready до проверки фактов.
Не публикуй и не отправляй сообщения. После проверки редактором добавь статью в content/articles.json,
запусти npm run content:check и npm run build, затем подготовь изменение к публикации.

Критерий готовности: читатель может подготовить запрос фабрике, а все коммерческие утверждения имеют основание.
`;
writeFileSync(`${root}/drafts/${topic.id}.md`, prompt, { flag: 'wx' });
console.log(`Подготовлено задание: drafts/${topic.id}.md`);
