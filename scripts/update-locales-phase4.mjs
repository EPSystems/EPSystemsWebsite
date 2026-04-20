// One-shot script to update BG/EN locales for Phase 4:
//  - Replace servicePages with 5 AI pillar entries
//  - Replace servicesHub with new 5-pillar + howWeWork + AI whyUs content
//  - Add industries (insurance full, ecommerce stub, fitness stub)
// Run: node scripts/update-locales-phase4.mjs

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BG_PATH = resolve(__dirname, '../src/i18n/locales/bg/common.json')
const EN_PATH = resolve(__dirname, '../src/i18n/locales/en/common.json')

const REPLACE_PRICING = '[REPLACE: потвърдете актуалната ценова рамка с Emo]'
const REPLACE_PRICING_EN = '[REPLACE: confirm pricing range with Emo]'
const REPLACE_CASE = '[REPLACE: добавете реален казус след одобрение от клиента]'
const REPLACE_CASE_EN = '[REPLACE: add real case study after client approval]'

const SLUGS = ['ai-websites', 'ai-automation', 'ai-agents', 'ai-seo', 'ai-ecommerce']

// --- BG content for the 5 AI pillars -----------------------------------------
const bgPages = {
  'ai-websites': {
    meta: {
      title: 'AI Уеб Сайтове - E&P Systems',
      description: 'Сайт, който сам отговаря на клиенти и превръща посетители в лийдове. AI чат, лийд квалификация, SEO старт.',
    },
    hero: {
      badge: 'AI Уеб Сайтове',
      heading: 'Сайт, който разговаря с клиентите ви.',
      subheading: 'Превръщаме уебсайта ви в 24/7 служител - отговаря на въпроси, квалифицира лийдове и събира данни, докато вие спите.',
    },
    features: {
      heading: 'Какво получавате',
      items: {
        0: { title: 'Вграден AI чат', description: 'Обучен на вашите услуги, цени и FAQ. Отговаря на български и английски без загуба на смисъл.' },
        1: { title: 'Лийд квалификация', description: 'AI задава правилните въпроси, маркира горещите лийдове и ги праща директно на CRM или имейл.' },
        2: { title: 'AI-подсилен SEO старт', description: 'Технически одит, структурирани данни, оптимизирани мета тагове и hreflang от първия ден.' },
        3: { title: 'Бърз front-end', description: 'React или Next.js с модерна архитектура - под 2 секунди зареждане, 90+ Lighthouse оценка.' },
      },
    },
    personas: {
      heading: 'За кого е това',
      items: {
        0: { title: 'Застрахователни брокери', description: 'Клиенти задават едни и същи въпроси за полици, срокове и документи - оставете AI да отговаря.' },
        1: { title: 'E-commerce магазини с растящ support', description: 'Повечето запитвания са за наличност, доставка или връщане. AI ги решава, преди да станат тикет.' },
        2: { title: 'Услугови бизнеси, които губят лийдове след работно време', description: 'Половината запитвания идват вечер и в уикенда. AI не си взима отпуска.' },
      },
    },
    process: {
      heading: 'Как го правим',
      steps: {
        0: { title: 'Бриф', description: 'Дефинираме целите, аудиторията и какво трябва да прави сайтът.' },
        1: { title: 'Дизайн', description: 'Неоbrutalist визуал с brand identity, оптимизиран за конверсия.' },
        2: { title: 'Разработка + AI', description: 'Изграждаме сайта и обучаваме AI чата на вашите данни.' },
        3: { title: 'Старт + поддръжка', description: 'Пускаме с мониторинг и месечна оптимизация на AI отговорите.' },
      },
    },
    caseStudy: {
      badge: 'Реален пример',
      metric: '60-80%',
      metricLabel: 'от запитванията - обработени без човек',
      title: 'AI чат за застрахователен брокер',
      description: 'Изградихме AI асистент за брокер в България, който отговаря на типичните въпроси за автомобилни и имуществени застраховки. Спестява часове ръчна комуникация седмично.',
      flag: REPLACE_CASE,
    },
    pricing: {
      heading: 'Инвестиция',
      description: 'Цената зависи от размера на сайта, броя интеграции и сложността на AI чата. Правим ви конкретна оферта след 30-минутна консултация.',
      rangeLabel: 'От',
      range: '€1,500+',
      button: 'Поискайте оферта',
      flag: REPLACE_PRICING,
    },
    faq: {
      heading: 'Често задавани въпроси',
      items: {
        0: { q: 'Колко време отнема изграждането?', a: 'Типично 3-6 седмици в зависимост от сложността. AI обучението отнема допълнително 1-2 седмици.' },
        1: { q: 'На какви езици работи AI чатът?', a: 'Български и английски. Качеството на българския е сравнимо с английския при използване на съвременни LLM модели.' },
        2: { q: 'Мога ли да обновявам сайта сам?', a: 'Да, доставяме с CMS опции. За AI чата има админ панел, от който можете да добавяте/редактирате знания.' },
        3: { q: 'Колко струва AI поддръжката?', a: 'API таксите зависят от обема - обикновено €30-150 на месец за среден бизнес. Нашата поддръжка е отделен абонамент.' },
        4: { q: 'Какво става с GDPR и лични данни?', a: 'Изграждаме с privacy by design - не съхраняваме разговори с лични данни в AI контекст, имаме ясна политика и GDPR съвместимост.' },
      },
    },
    cta: {
      heading: 'Готови ли сте за сайт, който работи за вас 24/7?',
      description: 'Безплатна консултация - ще проверим дали AI сайт е правилното решение за вашия бизнес.',
      button: 'Безплатна консултация',
    },
  },

  'ai-automation': {
    meta: {
      title: 'AI Автоматизации - E&P Systems',
      description: 'Автоматизираме ръчните процеси, които крадат часове от седмицата ви. n8n + Claude API работни потоци за реални резултати.',
    },
    hero: {
      badge: 'AI Автоматизации',
      heading: 'Спрете да губите часове на ръчна работа.',
      subheading: 'Автоматизираме повтарящите се процеси с n8n + Claude API - от обработка на фактури и имейли до CRM синхронизации и известия.',
    },
    features: {
      heading: 'Какво получавате',
      items: {
        0: { title: 'n8n + Claude API работни потоци', description: 'Self-hosted или cloud - стек, който контролирате, без vendor lock-in.' },
        1: { title: 'Интеграции с вашите инструменти', description: 'Gmail, Slack, Sheets, WhatsApp, CRM системи, календари - свързваме всичко.' },
        2: { title: 'Обработка на неструктурирани данни', description: 'Фактури, имейли, документи - AI извлича данни и ги въвежда в системите ви автоматично.' },
        3: { title: 'Ясни ROI метрики', description: 'Преди старт изчисляваме спестените часове на месец. След старт показваме реалните числа.' },
      },
    },
    personas: {
      heading: 'За кого е това',
      items: {
        0: { title: 'Счетоводни и юридически фирми', description: 'Ръчно въвеждане на данни, обработка на документи, проследяване на срокове - всичко автоматизируемо.' },
        1: { title: 'Малки бизнеси с повтарящи се процеси', description: 'Същите задачи всяка седмица? Автоматизирайте веднъж, спестявайте вечно.' },
        2: { title: 'Маркетинг и sales екипи', description: 'Lead scoring, follow-up imails, CRM синхронизации - нека AI се грижи за рутината.' },
      },
    },
    process: {
      heading: 'Как го правим',
      steps: {
        0: { title: 'Оценка', description: 'Определяме кои процеси ще донесат най-голям ROI при автоматизация.' },
        1: { title: 'Прототип', description: 'Изграждаме работещ proof-of-concept за валидация за 1 седмица.' },
        2: { title: 'Продукция', description: 'Деплойваме с мониторинг, error handling и документация.' },
        3: { title: 'Оптимизация', description: 'Измерваме резултати и настройваме за максимално въздействие.' },
      },
    },
    caseStudy: {
      badge: 'Реален пример',
      metric: '10+ часа',
      metricLabel: 'спестени седмично',
      title: 'SMS автоматизация за застрахователен брокер',
      description: 'Изградихме система, която автоматично изпраща напомняния на клиенти преди изтичане на полица - елиминира ръчното проследяване и подобрява запазването на клиентите.',
      flag: REPLACE_CASE,
    },
    pricing: {
      heading: 'Инвестиция',
      description: 'Проектите започват от еднократна такса за setup плюс месечен абонамент за API и поддръжка. Правим ROI калкулация преди да започнем.',
      rangeLabel: 'От',
      range: '€800 + €50/мес',
      button: 'Поискайте ROI калкулация',
      flag: REPLACE_PRICING,
    },
    faq: {
      heading: 'Често задавани въпроси',
      items: {
        0: { q: 'Кои процеси са подходящи за автоматизация?', a: 'Всичко повтарящо се, с ясни правила или донни за обучение - обработка на имейли, въвеждане на данни, синхронизации, lead qualification, отчети.' },
        1: { q: 'Сигурна ли е AI обработката на моите данни?', a: 'Да. Изграждаме с privacy by design - чувствителните данни не се съхраняват в AI контекст, използваме криптиране и имаме ясни data flows.' },
        2: { q: 'Какво ако автоматизацията се счупи?', a: 'Всеки workflow има error handling и известия. При проблем получавате аларма преди да е станало видимо за клиентите ви.' },
        3: { q: 'Колко време отнема внедряването?', a: 'Прост workflow - 1 седмица. Сложна интеграция - 3-4 седмици. Винаги даваме конкретен срок след discovery.' },
        4: { q: 'Колко ще спестя реално?', a: 'Типичните клиенти спестяват 5-15 часа седмично. Период на изплащане под 3 месеца при средно сложни проекти.' },
      },
    },
    cta: {
      heading: 'Готови ли сте да върнете часовете си?',
      description: 'Безплатна 30-минутна консултация - идентифицираме най-голямата възможност за автоматизация във вашия бизнес.',
      button: 'Безплатна консултация',
    },
  },

  'ai-agents': {
    meta: {
      title: 'Персонални AI Агенти - E&P Systems',
      description: 'AI служител, който работи 24/7 на вашите данни. Обучен на вашата база от знания, интегриран с CRM, с human handoff за сложни случаи.',
    },
    hero: {
      badge: 'AI Агенти',
      heading: 'AI служител, който не спи.',
      subheading: 'Персонален AI агент, обучен на вашите данни - отговаря на клиенти, обработва заявки и се интегрира със системите ви. 24/7, на български и английски.',
    },
    features: {
      heading: 'Какво получавате',
      items: {
        0: { title: 'Обучен на вашата база от знания', description: 'Документи, FAQ, политики, продуктов каталог - AI знае точно това, което трябва да знае.' },
        1: { title: 'Multichannel комуникация', description: 'Messenger, WhatsApp, имейл, сайт чат - един AI агент на всички канали.' },
        2: { title: 'Human handoff за сложни случаи', description: 'AI знае границите си - когато нещо е извън неговите възможности, прехвърля на човек с контекст.' },
        3: { title: 'Аналитика и непрекъснато обучение', description: 'Виждате какви въпроси идват, къде AI е слаб и как да го подобрите с нови данни.' },
      },
    },
    personas: {
      heading: 'За кого е това',
      items: {
        0: { title: 'Бизнеси с много клиентски запитвания', description: 'Ако екипът ви отговаря на едни и същи въпроси ден след ден - AI агентът е вашето решение.' },
        1: { title: 'Онлайн магазини с голям support volume', description: 'Статус на поръчки, наличност, връщания - AI агентът обработва 70%+ без човешка намеса.' },
        2: { title: 'Обучителни организации и курсове', description: 'Въпроси за съдържание, записване, сертификати - AI агент, който знае програмата отвътре.' },
      },
    },
    process: {
      heading: 'Как го правим',
      steps: {
        0: { title: 'Data discovery', description: 'Събираме и структурираме знанията на вашия бизнес - FAQ, документи, продуктови данни.' },
        1: { title: 'Обучение', description: 'Конфигурираме AI агента с RAG архитектура върху вашите данни.' },
        2: { title: 'Интеграция', description: 'Свързваме с каналите ви - Messenger, WhatsApp, имейл, CRM.' },
        3: { title: 'Мониторинг', description: 'Следим качеството на отговорите и фино настройваме седмично.' },
      },
    },
    caseStudy: {
      badge: 'Реален пример',
      metric: '24/7',
      metricLabel: 'отговори без пропуснати клиенти',
      title: 'AI агент за клиентско обслужване',
      description: 'Изграждаме AI агенти за български бизнеси, които обработват типичните въпроси денонощно - от застрахователни запитвания до e-commerce поддръжка.',
      flag: REPLACE_CASE,
    },
    pricing: {
      heading: 'Инвестиция',
      description: 'AI агент с обучение и интеграции е еднократна такса плюс месечен абонамент за API, хостинг и поддръжка.',
      rangeLabel: 'От',
      range: '€1,200 + €80/мес',
      button: 'Поискайте оферта',
      flag: REPLACE_PRICING,
    },
    faq: {
      heading: 'Често задавани въпроси',
      items: {
        0: { q: 'Колко добре говори български?', a: 'Съвременните модели (Claude, GPT-4) говорят отличен български - разбират идиоми, форми на учтивост, технически термини. Не използваме машинен превод от английски.' },
        1: { q: 'Какво става, когато AI не знае отговор?', a: 'Конфигурираме human handoff - AI предава разговора на човек с пълен контекст. Не измисля отговори.' },
        2: { q: 'Мога ли да обновявам знанията?', a: 'Да, има админ панел за добавяне/редактиране на документи и FAQ. Промените са активни за минути.' },
        3: { q: 'На кои канали работи?', a: 'Messenger, WhatsApp, Telegram, имейл, сайт чат, Slack - всеки популярен канал с API.' },
        4: { q: 'Каква е разликата с обикновен чатбот?', a: 'Rule-based чатботове работят по дърво от правила. AI агентът разбира контекст, запомня разговор и дава смислени отговори дори на въпроси, които не сте предвидили.' },
      },
    },
    cta: {
      heading: 'Искате AI служител за вашия бизнес?',
      description: 'Безплатна консултация - покажете ни данните и процесите си, ние ще покажем какво може AI агент за вас.',
      button: 'Безплатна консултация',
    },
  },

  'ai-seo': {
    meta: {
      title: 'AI SEO - E&P Systems',
      description: 'Повече органичен трафик без ръчно писане на съдържание. AI content pipelines, programmatic SEO, технически одити.',
    },
    hero: {
      badge: 'AI SEO',
      heading: 'Повече трафик, по-малко ръчна работа.',
      subheading: 'AI-подсилени content pipelines, programmatic SEO и технически одити - мащабирайте видимостта си без да наемате копирайтър екип.',
    },
    features: {
      heading: 'Какво получавате',
      items: {
        0: { title: 'AI content pipeline с контрол на качеството', description: 'Claude генерира чернови, ние ги редактираме и оптимизираме. Не публикуваме неща, които не бихме публикували сами.' },
        1: { title: 'Programmatic SEO', description: 'Десетки или стотици страници, базирани на data - идеално за e-commerce, услуги по градове или сравнения.' },
        2: { title: 'Технически одит + оптимизация', description: 'Core Web Vitals, crawlability, структурирани данни, hreflang - основите, които Google очаква.' },
        3: { title: 'Keyword strategy + content map', description: 'Изграждаме topic clusters и вътрешно свързване, които показват авторитет пред Google.' },
      },
    },
    personas: {
      heading: 'За кого е това',
      items: {
        0: { title: 'E-commerce с много продукти', description: 'AI генерира уникални продуктови описания и категорийни страници, които ранкват.' },
        1: { title: 'Услугови бизнеси, които искат да доминират в локално търсене', description: 'Programmatic страници за градове, райони или типове услуги - покриваме long-tail keywords, които иначе пропускате.' },
        2: { title: 'B2B компании, които искат thought leadership', description: 'AI-assisted дълго съдържание, редактирано от експерти - блог, който реално ранкирва.' },
      },
    },
    process: {
      heading: 'Как го правим',
      steps: {
        0: { title: 'Одит', description: 'Пълен технически + content одит с конкретен план за action.' },
        1: { title: 'Стратегия', description: 'Keyword research, content map, programmatic възможности.' },
        2: { title: 'Изпълнение', description: 'Технически fixes, AI content pipeline, on-page оптимизация.' },
        3: { title: 'Отчет + оптимизация', description: 'Месечни отчети с ranking changes, трафик и препоръки.' },
      },
    },
    caseStudy: {
      badge: 'Реален пример',
      metric: '+127%',
      metricLabel: 'органичен трафик за 3 месеца',
      title: 'Ozonic.bg - пълен SEO одит + оптимизация',
      description: 'Комбинация от технически одит, keyword стратегия и on-page оптимизация доведе до значителен ръст в органичния трафик за 3 месеца.',
      flag: '[REPLACE: потвърдете, че +127% Ozonic резултат е безопасен за публично споделяне (NDA check)]',
    },
    pricing: {
      heading: 'Инвестиция',
      description: 'SEO е дългосрочна инвестиция - работим на месечен абонамент с ясни KPIs и отчитане.',
      rangeLabel: 'От',
      range: '€500/мес',
      button: 'Поискайте SEO одит',
      flag: REPLACE_PRICING,
    },
    faq: {
      heading: 'Често задавани въпроси',
      items: {
        0: { q: 'Колко време до резултати?', a: 'Първи измерими подобрения за 2-3 месеца, значителен ръст за 6 месеца. SEO компаундира - колкото повече работите, толкова повече расте.' },
        1: { q: 'Ранкира ли AI-генериран content в Google?', a: 'Да, когато е с редактирано и с реална стойност. Google наказва thin, generic AI content - не публикуваме такъв.' },
        2: { q: 'Гарантирате ли позиции?', a: 'Никой SEO специалист не може честно да гарантира конкретни позиции. Гарантираме методичен подход, прозрачно отчитане и реална работа.' },
        3: { q: 'Мога ли да запазя настоящия си сайт?', a: 'Да, почти винаги работим върху съществуващия сайт. Препоръчваме редизайн само когато технически ограничения го налагат.' },
        4: { q: 'Какво е programmatic SEO?', a: 'Създаване на десетки/стотици страници от шаблон + данни - примерно "счетоводител в [град]" за всеки град в България. Работи за long-tail keywords с висок collective volume.' },
      },
    },
    cta: {
      heading: 'Готови ли сте за повече органичен трафик?',
      description: 'Безплатен SEO одит - ще покажем къде губите трафик и как AI може да го върне.',
      button: 'Безплатен SEO одит',
    },
  },

  'ai-ecommerce': {
    meta: {
      title: 'AI E-Commerce - E&P Systems',
      description: 'Онлайн магазин с AI описания, препоръки и поддръжка. Shopify, WooCommerce или персонализирано - плюс AI слой за растеж.',
    },
    hero: {
      badge: 'AI E-Commerce',
      heading: 'Магазин, който продава сам.',
      subheading: 'Shopify, WooCommerce или персонализирана платформа - плюс AI слой за продуктови описания, препоръки и 24/7 поддръжка.',
    },
    features: {
      heading: 'Какво получавате',
      items: {
        0: { title: 'Shopify, WooCommerce или custom React', description: 'Избираме правилната платформа за вашия мащаб, бюджет и бъдещи планове.' },
        1: { title: 'AI продуктови описания', description: 'Уникални, SEO-оптимизирани описания за всеки продукт - стотици продукти за дни, не месеци.' },
        2: { title: 'AI препоръки за клиенти', description: 'Персонализирани препоръки в реално време - повишават average order value с 15-30%.' },
        3: { title: 'AI customer support 24/7', description: 'Автоматични отговори за статус на поръчки, връщания, наличност - 80% от тикетите без човек.' },
      },
    },
    personas: {
      heading: 'За кого е това',
      items: {
        0: { title: 'Нови магазини, които искат бърз старт', description: 'От нула до продажби за 3-4 седмици с AI съдържание и настройки от първия ден.' },
        1: { title: 'Съществуващи магазини с голям каталог', description: 'Стотици продукти без правилни описания? AI ги пренаписва за дни с контрол на качеството.' },
        2: { title: 'Магазини с растящ support обем', description: 'Ако customer service отнема повече време от растежа - AI поддръжката е вашето решение.' },
      },
    },
    process: {
      heading: 'Как го правим',
      steps: {
        0: { title: 'Проучване', description: 'Каталог, плащания, логистика, бранд - картографираме всичко преди да започнем.' },
        1: { title: 'Дизайн + платформа', description: 'Конверсионно-оптимизиран дизайн на правилната платформа за вашите нужди.' },
        2: { title: 'AI интеграция', description: 'Описания, препоръки, AI support - всичко свързано и тествано.' },
        3: { title: 'Старт + растеж', description: 'Пускаме с мониторинг, след това работим по оптимизация на конверсията.' },
      },
    },
    caseStudy: {
      badge: 'Реален пример',
      metric: 'InfinityStore',
      metricLabel: 'напълно персонализиран e-commerce',
      title: 'InfinityStore - custom онлайн магазин',
      description: 'Изградихме напълно персонализиран e-commerce магазин, пригоден към бранда - изчистен дизайн, гладко плащане, всичко работи точно както клиентът искаше.',
      flag: REPLACE_CASE,
    },
    pricing: {
      heading: 'Инвестиция',
      description: 'Цената зависи от платформата, броя продукти и AI функциите. Shopify/WooCommerce проекти започват по-ниско, custom платформи - нагоре.',
      rangeLabel: 'От',
      range: '€2,000+',
      button: 'Поискайте оферта',
      flag: REPLACE_PRICING,
    },
    faq: {
      heading: 'Често задавани въпроси',
      items: {
        0: { q: 'Shopify, WooCommerce или custom?', a: 'Shopify - бърз старт, отлична логистика. WooCommerce - гъвкавост, контрол на данните. Custom - когато имате нестандартни нужди. Препоръчваме след discovery.' },
        1: { q: 'Качвате ли продуктите?', a: 'Да, initial setup на каталога е включен. За големи каталози AI помага с описанията и категоризацията.' },
        2: { q: 'Можете ли да мигрирате съществуващ магазин?', a: 'Да, пълни миграции включително продукти, клиентски данни и история на поръчки.' },
        3: { q: 'Как работи AI preporъките?', a: 'AI анализира поведението на клиента (гледани продукти, история, корелации) и предлага релевантни артикули - като Amazon, но за вашия каталог.' },
        4: { q: 'Какво с плащанията в България?', a: 'Интегрираме всички локални опции - банкови карти, ePay, Revolut, наложен платеж - плюс Stripe и PayPal за международни клиенти.' },
      },
    },
    cta: {
      heading: 'Готови ли сте за магазин, който продава сам?',
      description: 'Безплатна консултация - ще препоръчаме правилната платформа и AI стек за вашия бизнес.',
      button: 'Безплатна консултация',
    },
  },
}

// --- EN content ---------------------------------------------------------------
const enPages = {
  'ai-websites': {
    meta: {
      title: 'AI Websites - E&P Systems',
      description: 'A website that talks to your customers and turns visitors into leads. AI chat, lead qualification, SEO head start.',
    },
    hero: {
      badge: 'AI Websites',
      heading: 'A website that talks to your customers.',
      subheading: "We turn your website into a 24/7 employee — answering questions, qualifying leads, and collecting data while you sleep.",
    },
    features: {
      heading: 'What you get',
      items: {
        0: { title: 'Built-in AI chat', description: 'Trained on your services, pricing, and FAQs. Answers in Bulgarian and English without losing nuance.' },
        1: { title: 'Lead qualification', description: "AI asks the right questions, flags hot leads, and routes them straight to your CRM or inbox." },
        2: { title: 'AI-powered SEO head start', description: 'Technical audit, structured data, optimized meta tags, and hreflang from day one.' },
        3: { title: 'Fast front-end', description: 'React or Next.js with modern architecture — under 2s load time, 90+ Lighthouse score.' },
      },
    },
    personas: {
      heading: 'Who this is for',
      items: {
        0: { title: 'Insurance brokers', description: 'Clients ask the same questions about policies, deadlines, and documents — let AI answer.' },
        1: { title: 'E-commerce stores with rising support load', description: 'Most questions are about stock, shipping, or returns. AI resolves them before they become tickets.' },
        2: { title: 'Service businesses losing leads after hours', description: 'Half of inquiries come in the evening or weekend. AI does not take vacations.' },
      },
    },
    process: {
      heading: 'How we do it',
      steps: {
        0: { title: 'Brief', description: 'We define goals, audience, and what the site needs to do.' },
        1: { title: 'Design', description: 'Neo-brutalist visual with your brand identity, optimized for conversion.' },
        2: { title: 'Build + AI', description: 'We ship the site and train the AI chat on your data.' },
        3: { title: 'Launch + iterate', description: 'We launch with monitoring and fine-tune the AI weekly.' },
      },
    },
    caseStudy: {
      badge: 'Real example',
      metric: '60-80%',
      metricLabel: 'of inquiries handled without a human',
      title: 'AI chat for an insurance broker',
      description: 'We built an AI assistant for a Bulgarian insurance broker that answers typical questions about auto and property coverage — saving hours of manual communication per week.',
      flag: REPLACE_CASE_EN,
    },
    pricing: {
      heading: 'Investment',
      description: 'Pricing depends on site scope, integrations, and AI chat complexity. We give you a concrete quote after a 30-minute consultation.',
      rangeLabel: 'From',
      range: '€1,500+',
      button: 'Request a quote',
      flag: REPLACE_PRICING_EN,
    },
    faq: {
      heading: 'Frequently asked questions',
      items: {
        0: { q: 'How long does it take to build?', a: 'Typically 3-6 weeks depending on complexity. AI training adds another 1-2 weeks.' },
        1: { q: 'What languages does the AI chat support?', a: 'Bulgarian and English. Bulgarian quality is on par with English on modern LLMs — not machine-translated.' },
        2: { q: 'Can I update the site myself?', a: 'Yes, we ship with CMS options. The AI chat has an admin panel to add or edit knowledge.' },
        3: { q: 'What does the AI cost to run?', a: 'API fees scale with volume — typically €30-150/month for a mid-sized business. Our support is a separate subscription.' },
        4: { q: 'What about GDPR and personal data?', a: 'We build with privacy by design — no personal data in AI context, clear policy, and full GDPR compliance.' },
      },
    },
    cta: {
      heading: 'Ready for a website that works for you 24/7?',
      description: "Free consultation — we'll check whether an AI website is the right fit for your business.",
      button: 'Free consultation',
    },
  },

  'ai-automation': {
    meta: {
      title: 'AI Automation - E&P Systems',
      description: 'We automate the manual processes stealing hours from your week. n8n + Claude API workflows with real ROI.',
    },
    hero: {
      badge: 'AI Automation',
      heading: 'Stop losing hours to manual work.',
      subheading: 'We automate repetitive processes with n8n + Claude API — from invoice and email handling to CRM syncs and notifications.',
    },
    features: {
      heading: 'What you get',
      items: {
        0: { title: 'n8n + Claude API workflows', description: 'Self-hosted or cloud — a stack you control, with no vendor lock-in.' },
        1: { title: 'Integrations with your tools', description: 'Gmail, Slack, Sheets, WhatsApp, CRMs, calendars — we connect everything.' },
        2: { title: 'Unstructured data extraction', description: 'Invoices, emails, documents — AI pulls the data and enters it into your systems automatically.' },
        3: { title: 'Clear ROI metrics', description: 'We calculate hours saved per month before kickoff and track real numbers after launch.' },
      },
    },
    personas: {
      heading: 'Who this is for',
      items: {
        0: { title: 'Accounting and legal firms', description: 'Manual data entry, document processing, deadline tracking — all automatable.' },
        1: { title: 'Small businesses with repeating processes', description: 'Same tasks every week? Automate once, save forever.' },
        2: { title: 'Marketing and sales teams', description: 'Lead scoring, follow-up emails, CRM sync — let AI handle the grind.' },
      },
    },
    process: {
      heading: 'How we do it',
      steps: {
        0: { title: 'Assess', description: 'We identify which processes yield the biggest ROI when automated.' },
        1: { title: 'Prototype', description: 'We build a working proof-of-concept to validate the approach in a week.' },
        2: { title: 'Production', description: 'We deploy with monitoring, error handling, and documentation.' },
        3: { title: 'Optimize', description: 'We measure results and fine-tune for maximum impact.' },
      },
    },
    caseStudy: {
      badge: 'Real example',
      metric: '10+ hrs',
      metricLabel: 'saved per week',
      title: 'SMS automation for an insurance broker',
      description: "We built a system that automatically sends renewal reminders before a policy expires — eliminating manual follow-up and improving client retention.",
      flag: REPLACE_CASE_EN,
    },
    pricing: {
      heading: 'Investment',
      description: 'Projects start with a one-time setup fee plus a monthly subscription for API and support. We run ROI math before we start.',
      rangeLabel: 'From',
      range: '€800 + €50/mo',
      button: 'Request ROI estimate',
      flag: REPLACE_PRICING_EN,
    },
    faq: {
      heading: 'Frequently asked questions',
      items: {
        0: { q: 'Which processes are good candidates?', a: 'Anything repetitive with clear rules or training data — email handling, data entry, syncs, lead qualification, reports.' },
        1: { q: 'Is AI handling of my data secure?', a: 'Yes. We build with privacy by design — sensitive data is not stored in AI context, we use encryption and clear data flows.' },
        2: { q: 'What if an automation breaks?', a: 'Every workflow has error handling and alerts. You get notified before clients notice.' },
        3: { q: 'How long does implementation take?', a: 'Simple workflow — 1 week. Complex integration — 3-4 weeks. We always give you a concrete timeline after discovery.' },
        4: { q: "How much will I actually save?", a: 'Typical clients save 5-15 hours per week. Payback under 3 months on medium-complexity projects.' },
      },
    },
    cta: {
      heading: 'Ready to get your hours back?',
      description: "Free 30-minute consultation — we'll identify the biggest automation opportunity in your business.",
      button: 'Free consultation',
    },
  },

  'ai-agents': {
    meta: {
      title: 'Custom AI Agents - E&P Systems',
      description: 'An AI employee that works 24/7 on your data. Trained on your knowledge base, integrated with CRM, human handoff for complex cases.',
    },
    hero: {
      badge: 'AI Agents',
      heading: 'An AI employee that never sleeps.',
      subheading: 'A custom AI agent trained on your data — answers customers, processes requests, and integrates with your systems. 24/7, Bulgarian and English.',
    },
    features: {
      heading: 'What you get',
      items: {
        0: { title: 'Trained on your knowledge base', description: 'Documents, FAQs, policies, product catalog — the AI knows exactly what it needs to know.' },
        1: { title: 'Multichannel communication', description: 'Messenger, WhatsApp, email, site chat — one AI agent across every channel.' },
        2: { title: 'Human handoff for complex cases', description: "The AI knows its limits — when something is beyond its reach, it hands off to a human with context." },
        3: { title: 'Analytics and continuous learning', description: 'See what questions come in, where the AI is weak, and how to improve it with new data.' },
      },
    },
    personas: {
      heading: 'Who this is for',
      items: {
        0: { title: 'Businesses with heavy customer inquiry load', description: 'If your team answers the same questions day after day — the AI agent is your answer.' },
        1: { title: 'Online stores with high support volume', description: 'Order status, stock, returns — the AI agent handles 70%+ without human intervention.' },
        2: { title: 'Training organizations and courses', description: 'Questions about curriculum, enrollment, certificates — an AI agent that knows your program inside out.' },
      },
    },
    process: {
      heading: 'How we do it',
      steps: {
        0: { title: 'Data discovery', description: "We collect and structure your business's knowledge — FAQs, docs, product data." },
        1: { title: 'Training', description: 'We configure the AI agent with RAG architecture over your data.' },
        2: { title: 'Integration', description: 'We connect to your channels — Messenger, WhatsApp, email, CRM.' },
        3: { title: 'Monitoring', description: 'We track answer quality and fine-tune weekly.' },
      },
    },
    caseStudy: {
      badge: 'Real example',
      metric: '24/7',
      metricLabel: 'coverage, no missed customers',
      title: 'AI agent for customer service',
      description: 'We build AI agents for Bulgarian businesses that handle typical inquiries around the clock — from insurance questions to e-commerce support.',
      flag: REPLACE_CASE_EN,
    },
    pricing: {
      heading: 'Investment',
      description: 'An AI agent with training and integrations is a one-time fee plus a monthly subscription for API, hosting, and support.',
      rangeLabel: 'From',
      range: '€1,200 + €80/mo',
      button: 'Request a quote',
      flag: REPLACE_PRICING_EN,
    },
    faq: {
      heading: 'Frequently asked questions',
      items: {
        0: { q: 'How well does it speak Bulgarian?', a: 'Modern models (Claude, GPT-4) speak excellent Bulgarian — they understand idioms, formal register, and technical terms. No machine translation.' },
        1: { q: "What happens when the AI doesn't know?", a: 'We configure human handoff — the AI passes the conversation to a human with full context. It does not invent answers.' },
        2: { q: 'Can I update the knowledge?', a: 'Yes, there is an admin panel for adding or editing documents and FAQs. Changes are live in minutes.' },
        3: { q: 'What channels does it run on?', a: 'Messenger, WhatsApp, Telegram, email, site chat, Slack — any popular channel with an API.' },
        4: { q: "What's the difference vs a regular chatbot?", a: 'Rule-based chatbots follow a decision tree. An AI agent understands context, remembers the conversation, and gives useful answers even to questions you did not anticipate.' },
      },
    },
    cta: {
      heading: 'Want an AI employee for your business?',
      description: "Free consultation — show us your data and processes and we'll show you what an AI agent can do.",
      button: 'Free consultation',
    },
  },

  'ai-seo': {
    meta: {
      title: 'AI SEO - E&P Systems',
      description: 'More organic traffic without manually writing every article. AI content pipelines, programmatic SEO, technical audits.',
    },
    hero: {
      badge: 'AI SEO',
      heading: 'More traffic, less manual work.',
      subheading: 'AI-powered content pipelines, programmatic SEO, and technical audits — scale your visibility without hiring a copywriter team.',
    },
    features: {
      heading: 'What you get',
      items: {
        0: { title: 'AI content pipeline with quality control', description: "Claude drafts, we edit and optimize. We do not ship anything we would not ship on our own name." },
        1: { title: 'Programmatic SEO', description: 'Dozens or hundreds of pages built from data — ideal for e-commerce, services by city, or comparisons.' },
        2: { title: 'Technical audit + optimization', description: 'Core Web Vitals, crawlability, structured data, hreflang — the foundations Google expects.' },
        3: { title: 'Keyword strategy + content map', description: 'We build topic clusters and internal linking that show Google authority.' },
      },
    },
    personas: {
      heading: 'Who this is for',
      items: {
        0: { title: 'E-commerce with large catalogs', description: 'AI generates unique product descriptions and category pages that rank.' },
        1: { title: 'Service businesses targeting local search', description: 'Programmatic pages for cities, districts, or service types — covering long-tail keywords you otherwise miss.' },
        2: { title: 'B2B companies pursuing thought leadership', description: 'AI-assisted long-form content, edited by experts — a blog that actually ranks.' },
      },
    },
    process: {
      heading: 'How we do it',
      steps: {
        0: { title: 'Audit', description: 'Full technical + content audit with a concrete action plan.' },
        1: { title: 'Strategy', description: 'Keyword research, content map, programmatic opportunities.' },
        2: { title: 'Execute', description: 'Technical fixes, AI content pipeline, on-page optimization.' },
        3: { title: 'Report + optimize', description: 'Monthly reports with ranking changes, traffic, and recommendations.' },
      },
    },
    caseStudy: {
      badge: 'Real example',
      metric: '+127%',
      metricLabel: 'organic traffic in 3 months',
      title: 'Ozonic.bg — full SEO audit + optimization',
      description: 'A combination of technical audit, keyword strategy, and on-page optimization drove significant organic traffic growth in three months.',
      flag: '[REPLACE: confirm +127% Ozonic figure is safe to publish (NDA check)]',
    },
    pricing: {
      heading: 'Investment',
      description: 'SEO is a long-term investment — we work on monthly retainers with clear KPIs and reporting.',
      rangeLabel: 'From',
      range: '€500/mo',
      button: 'Request an SEO audit',
      flag: REPLACE_PRICING_EN,
    },
    faq: {
      heading: 'Frequently asked questions',
      items: {
        0: { q: 'How long until results?', a: 'First measurable improvements at 2-3 months, significant growth by 6 months. SEO compounds — the more you work, the more it grows.' },
        1: { q: 'Does AI-generated content rank in Google?', a: 'Yes, when edited and genuinely valuable. Google penalizes thin, generic AI content — we do not publish that.' },
        2: { q: 'Do you guarantee rankings?', a: 'No ethical SEO specialist can honestly guarantee specific positions. We guarantee a methodical approach, transparent reporting, and real work.' },
        3: { q: 'Can I keep my current site?', a: 'Yes, we almost always work on the existing site. We recommend a rebuild only when technical limits force it.' },
        4: { q: 'What is programmatic SEO?', a: 'Creating dozens or hundreds of pages from template + data — e.g., "accountant in [city]" for every city in Bulgaria. Works for long-tail keywords with high collective volume.' },
      },
    },
    cta: {
      heading: 'Ready for more organic traffic?',
      description: "Free SEO audit — we'll show you where you're losing traffic and how AI can bring it back.",
      button: 'Free SEO audit',
    },
  },

  'ai-ecommerce': {
    meta: {
      title: 'AI E-Commerce - E&P Systems',
      description: 'An online store with AI descriptions, recommendations, and support. Shopify, WooCommerce, or custom — plus an AI layer for growth.',
    },
    hero: {
      badge: 'AI E-Commerce',
      heading: 'A store that sells on its own.',
      subheading: 'Shopify, WooCommerce, or a custom platform — plus an AI layer for product descriptions, recommendations, and 24/7 support.',
    },
    features: {
      heading: 'What you get',
      items: {
        0: { title: 'Shopify, WooCommerce, or custom React', description: 'We pick the right platform for your scale, budget, and future plans.' },
        1: { title: 'AI product descriptions', description: 'Unique, SEO-optimized descriptions for every product — hundreds of products in days, not months.' },
        2: { title: 'AI recommendations for customers', description: 'Real-time personalized recommendations — lift average order value by 15-30%.' },
        3: { title: '24/7 AI customer support', description: 'Automated answers for order status, returns, stock — 80% of tickets without a human.' },
      },
    },
    personas: {
      heading: 'Who this is for',
      items: {
        0: { title: 'New stores that want a fast start', description: 'From zero to sales in 3-4 weeks with AI content and setup from day one.' },
        1: { title: 'Existing stores with large catalogs', description: 'Hundreds of products without proper descriptions? AI rewrites them in days with quality control.' },
        2: { title: 'Stores with growing support volume', description: "If customer service is taking more time than growth — AI support is your answer." },
      },
    },
    process: {
      heading: 'How we do it',
      steps: {
        0: { title: 'Discovery', description: 'Catalog, payments, logistics, brand — we map everything before we start.' },
        1: { title: 'Design + platform', description: 'Conversion-optimized design on the right platform for your needs.' },
        2: { title: 'AI integration', description: 'Descriptions, recommendations, AI support — all connected and tested.' },
        3: { title: 'Launch + grow', description: 'We launch with monitoring, then work on conversion optimization.' },
      },
    },
    caseStudy: {
      badge: 'Real example',
      metric: 'InfinityStore',
      metricLabel: 'fully custom e-commerce',
      title: 'InfinityStore — custom online store',
      description: "We built a fully customized e-commerce store tailored to the client's brand — clean design, smooth checkout, everything working exactly as they wanted.",
      flag: REPLACE_CASE_EN,
    },
    pricing: {
      heading: 'Investment',
      description: 'Pricing depends on platform, product count, and AI features. Shopify/WooCommerce projects start lower; custom platforms, higher.',
      rangeLabel: 'From',
      range: '€2,000+',
      button: 'Request a quote',
      flag: REPLACE_PRICING_EN,
    },
    faq: {
      heading: 'Frequently asked questions',
      items: {
        0: { q: 'Shopify, WooCommerce, or custom?', a: 'Shopify — fast start, great logistics. WooCommerce — flexibility, data control. Custom — when you have non-standard needs. We recommend after discovery.' },
        1: { q: 'Do you handle product uploads?', a: 'Yes, initial catalog setup is included. For large catalogs, AI helps with descriptions and categorization.' },
        2: { q: 'Can you migrate an existing store?', a: 'Yes, full migrations including products, customer data, and order history.' },
        3: { q: 'How do AI recommendations work?', a: "AI analyzes customer behavior (viewed products, history, correlations) and suggests relevant items — like Amazon, but for your catalog." },
        4: { q: 'What about payments in Bulgaria?', a: 'We integrate all local options — bank cards, ePay, Revolut, cash-on-delivery — plus Stripe and PayPal for international customers.' },
      },
    },
    cta: {
      heading: 'Ready for a store that sells on its own?',
      description: "Free consultation — we'll recommend the right platform and AI stack for your business.",
      button: 'Free consultation',
    },
  },
}

// --- Services hub -------------------------------------------------------------
const bgServicesHub = {
  meta: {
    title: 'Нашите AI услуги - E&P Systems',
    description: '5 AI стълба за вашия бизнес: AI уеб сайтове, AI автоматизации, AI агенти, AI SEO и AI e-commerce.',
  },
  hero: {
    badge: 'Какво правим',
    heading: 'Нашите AI услуги',
    subheading: '5 AI стълба, които работят като един стек - от сайт до SEO до автоматизация.',
    intro: 'Всеки стълб може да се използва самостоятелно, но заедно формират пълна AI система за вашия бизнес. Започнете с един и разширете, когато видите резултатите.',
  },
  grid: {
    heading: 'Какво изграждаме',
    learnMore: 'Научете повече',
    cards: {
      aiWebsites: { title: 'AI Уеб Сайтове', description: 'Сайт, който сам отговаря на клиенти и превръща посетители в лийдове.' },
      aiAutomation: { title: 'AI Автоматизации', description: 'Автоматизираме ръчните процеси, които ви крадат часове всяка седмица.' },
      aiAgents: { title: 'AI Агенти', description: 'Персонален AI служител, който работи 24/7 на вашите данни.' },
      aiSeo: { title: 'AI SEO', description: 'Повече органичен трафик, без ръчно писане на съдържание.' },
      aiEcommerce: { title: 'AI E-Commerce', description: 'Онлайн магазин с AI описания, препоръки и поддръжка.' },
    },
  },
  howWeWork: {
    heading: 'Как работим',
    steps: {
      0: { title: 'Безплатна консултация', description: '30-минутен разговор, за да разберем бизнеса и процесите ви.' },
      1: { title: 'Техническо проучване', description: 'Одит на настоящото състояние и план с конкретни стъпки.' },
      2: { title: 'Внедряване', description: 'Изграждаме и интегрираме с вашите съществуващи инструменти.' },
      3: { title: 'Поддръжка и растеж', description: 'Мониторинг, оптимизация и нови функции, когато са нужни.' },
    },
  },
  whyUs: {
    heading: 'Защо да изберете нас',
    items: {
      engineering: { title: 'Инженерен подход', description: 'Опит в embedded системи (AUTOSAR) и full-stack разработка. Кодът ни работи.' },
      production: { title: 'AI от практиката', description: 'Изградили сме production AI системи, не само прототипи.' },
      native: { title: 'Двуезичен екип в София', description: 'Пълна комуникация на български, без загубено в превода.' },
      transparent: { title: 'Прозрачно ценообразуване', description: 'Знаете какво плащате и какво получавате - преди да напишем и един ред код.' },
    },
  },
  cta: {
    heading: 'Готови ли сте да започнете?',
    description: 'Разкажете ни за вашия бизнес и ще ви покажем къде AI ще донесе най-голямата стойност.',
    button: 'Безплатна AI консултация',
  },
}

const enServicesHub = {
  meta: {
    title: 'Our AI services - E&P Systems',
    description: '5 AI pillars for your business: AI websites, AI automation, AI agents, AI SEO, and AI e-commerce.',
  },
  hero: {
    badge: 'What we do',
    heading: 'Our AI services',
    subheading: '5 AI pillars that work as one stack — from your site to SEO to automation.',
    intro: 'Each pillar works standalone, but together they form a complete AI system for your business. Start with one and expand once you see results.',
  },
  grid: {
    heading: 'What we build',
    learnMore: 'Learn more',
    cards: {
      aiWebsites: { title: 'AI Websites', description: 'A website that talks to your customers and turns visitors into leads.' },
      aiAutomation: { title: 'AI Automation', description: 'We automate the manual processes stealing hours from your week.' },
      aiAgents: { title: 'AI Agents', description: 'A custom AI employee that works 24/7 on your data.' },
      aiSeo: { title: 'AI SEO', description: 'More organic traffic without manually writing every article.' },
      aiEcommerce: { title: 'AI E-Commerce', description: 'An online store with AI descriptions, recommendations, and support.' },
    },
  },
  howWeWork: {
    heading: 'How we work',
    steps: {
      0: { title: 'Free consultation', description: '30-minute conversation to understand your business and processes.' },
      1: { title: 'Technical discovery', description: 'Audit of the current state and a concrete, step-by-step plan.' },
      2: { title: 'Implementation', description: 'We build and integrate with your existing tools.' },
      3: { title: 'Support + growth', description: 'Monitoring, optimization, and new features as you need them.' },
    },
  },
  whyUs: {
    heading: 'Why choose us',
    items: {
      engineering: { title: 'Engineering-grade approach', description: 'Background in embedded systems (AUTOSAR) and full-stack. Our code works.' },
      production: { title: 'AI from practice, not tutorials', description: "We've shipped production AI systems, not just prototypes." },
      native: { title: 'Bilingual team in Sofia', description: 'Full communication in Bulgarian — nothing lost in translation.' },
      transparent: { title: 'Transparent pricing', description: "You know what you're paying for and what you're getting — before we write a line of code." },
    },
  },
  cta: {
    heading: 'Ready to get started?',
    description: "Tell us about your business and we'll show you where AI brings the biggest value.",
    button: 'Free AI consultation',
  },
}

// --- Industries (BG) ----------------------------------------------------------
const bgIndustries = {
  backHome: 'Към началото',
  insurance: {
    meta: {
      title: 'AI за застрахователни брокери в България - E&P Systems',
      description: 'Спестете 10+ часа седмично на ръчна работа. AI асистент, автоматизирани оферти, чатбот на български за застрахователни брокери.',
    },
    hero: {
      badge: 'Застраховане',
      heading: 'AI за застрахователни брокери в България.',
      subheading: 'Спестете 10+ часа седмично на ръчна работа. AI асистент, автоматизирани оферти, чатбот на български - специално за вашия сектор.',
    },
    problems: {
      badge: 'Проблемите, които познавате',
      heading: 'Защо брокерският бизнес губи време и клиенти.',
      items: {
        0: { title: 'Ръчно сравнение на полици', description: 'Часове на седмица отиват за сравнение на оферти между компании - времето за реална продажба изчезва.' },
        1: { title: 'Бавно изготвяне на оферти', description: 'Клиентът пита днес, получава оферта утре - конкурентът е вече отговорил.' },
        2: { title: 'Загуба на лийдове след работно време', description: 'Повече от половината запитвания идват вечер и в уикенда - остават без отговор.' },
        3: { title: 'Повтарящи се FAQ въпроси', description: 'Едни и същи въпроси за автомобилни застраховки, ГО, КАСКО - от всеки нов клиент.' },
      },
    },
    solutions: {
      badge: 'Какво решаваме с AI',
      heading: 'AI стек за брокерския бизнес.',
      items: {
        0: { title: 'AI асистент за сравнение на полици', description: 'Качвате условията, AI ги сравнява и извежда разликите - за секунди, не часове.' },
        1: { title: 'Автоматизирани оферти', description: 'Клиентът попълва форма, AI генерира персонализирана оферта и я праща по имейл/SMS за минути.' },
        2: { title: 'AI чатбот на български 24/7', description: 'Отговаря на типичните въпроси, квалифицира лийда и ви праща готови клиенти сутринта.' },
        3: { title: 'Автоматични напомняния за подновяване', description: 'SMS/имейл напомняния преди изтичане на полица - запазва клиенти без ръчно проследяване.' },
      },
    },
    proof: {
      badge: 'Реален пример',
      heading: 'SMS автоматизация за застрахователен брокер.',
      description: 'Изградихме система, която автоматично изпраща напомняния на клиенти преди изтичане на полицата им. Спестява часове ръчна работа и подобрява процента на подновяванията. Вариантите за разширение с AI асистент и онлайн сравняване на оферти са следващата стъпка за повечето брокери.',
      flag: '[REPLACE: потвърдете кой брокер е safe за публично споделяне (NDA check)]',
    },
    cta: {
      heading: 'Готови за 10+ спестени часа седмично?',
      description: 'Безплатен AI одит за брокери - показваме конкретно къде AI ще донесе ROI в следващите 3 месеца.',
      button: 'Безплатен AI одит',
    },
  },
  ecommerce: {
    meta: {
      title: 'AI за e-commerce в България - E&P Systems',
      description: 'AI описания, препоръки и поддръжка за онлайн магазини. Повишете конверсията и AOV с AI стек.',
    },
    hero: {
      badge: 'E-Commerce',
      heading: 'AI за онлайн магазини в България.',
      subheading: '[REPLACE: разгънете тази страница след одобрение на insurance wedge] Повишете конверсията, average order value и намалете support товара с AI стек.',
    },
    problems: {
      badge: 'Проблемите',
      heading: 'Защо много магазини буксуват.',
      items: {
        0: { title: '[REPLACE: проблем 1]', description: '[REPLACE: опишете проблем]' },
        1: { title: '[REPLACE: проблем 2]', description: '[REPLACE: опишете проблем]' },
        2: { title: '[REPLACE: проблем 3]', description: '[REPLACE: опишете проблем]' },
        3: { title: '[REPLACE: проблем 4]', description: '[REPLACE: опишете проблем]' },
      },
    },
    solutions: {
      badge: 'Какво решаваме',
      heading: 'AI стек за e-commerce.',
      items: {
        0: { title: '[REPLACE: решение 1]', description: '[REPLACE: опишете решение]' },
        1: { title: '[REPLACE: решение 2]', description: '[REPLACE: опишете решение]' },
        2: { title: '[REPLACE: решение 3]', description: '[REPLACE: опишете решение]' },
        3: { title: '[REPLACE: решение 4]', description: '[REPLACE: опишете решение]' },
      },
    },
    proof: {
      badge: 'Реален пример',
      heading: '[REPLACE: разгънете с InfinityStore казус]',
      description: '[REPLACE: опишете реален e-commerce проект]',
      flag: '[REPLACE: разширете тази страница след одобрение на реални казуси]',
    },
    cta: {
      heading: 'Готови за AI в магазина си?',
      description: 'Безплатна консултация - ще покажем конкретно какво AI може за вашия магазин.',
      button: 'Безплатна консултация',
    },
  },
  fitness: {
    meta: {
      title: 'AI за фитнес и спорт в България - E&P Systems',
      description: 'AI решения за фитнес клубове, треньори и спортни бизнеси.',
    },
    hero: {
      badge: 'Фитнес & Спорт',
      heading: 'AI за фитнес и спортни бизнеси.',
      subheading: '[REPLACE: разгънете след потвърждение на ReflexGym казус] AI асистент за записване на часове, персонализирани програми, автоматизиран support.',
    },
    problems: {
      badge: 'Проблемите',
      heading: 'Защо фитнес бизнесът губи време.',
      items: {
        0: { title: '[REPLACE: проблем 1]', description: '[REPLACE: опишете проблем]' },
        1: { title: '[REPLACE: проблем 2]', description: '[REPLACE: опишете проблем]' },
        2: { title: '[REPLACE: проблем 3]', description: '[REPLACE: опишете проблем]' },
        3: { title: '[REPLACE: проблем 4]', description: '[REPLACE: опишете проблем]' },
      },
    },
    solutions: {
      badge: 'Какво решаваме',
      heading: 'AI стек за фитнес бизнеси.',
      items: {
        0: { title: '[REPLACE: решение 1]', description: '[REPLACE: опишете решение]' },
        1: { title: '[REPLACE: решение 2]', description: '[REPLACE: опишете решение]' },
        2: { title: '[REPLACE: решение 3]', description: '[REPLACE: опишете решение]' },
        3: { title: '[REPLACE: решение 4]', description: '[REPLACE: опишете решение]' },
      },
    },
    proof: {
      badge: 'Реален пример',
      heading: '[REPLACE: разгънете с ReflexGym казус]',
      description: '[REPLACE: опишете реален фитнес проект]',
      flag: '[REPLACE: разширете след потвърждение на реални казуси]',
    },
    cta: {
      heading: 'AI за вашия фитнес бизнес?',
      description: 'Безплатна консултация - ще покажем къде AI ще спести време и ще привлече повече клиенти.',
      button: 'Безплатна консултация',
    },
  },
}

const enIndustries = {
  backHome: 'Back to home',
  insurance: {
    meta: {
      title: 'AI for insurance brokers in Bulgaria - E&P Systems',
      description: 'Save 10+ hours per week. AI assistant, automated quotes, Bulgarian chatbot for insurance brokers.',
    },
    hero: {
      badge: 'Insurance',
      heading: 'AI for insurance brokers in Bulgaria.',
      subheading: 'Save 10+ hours per week of manual work. AI assistant, automated quotes, Bulgarian chatbot — built specifically for your sector.',
    },
    problems: {
      badge: 'Problems you know',
      heading: 'Why broker businesses lose time and customers.',
      items: {
        0: { title: 'Manual policy comparison', description: 'Hours per week go into comparing offers between carriers — time for real selling disappears.' },
        1: { title: 'Slow quote turnaround', description: "The client asks today, gets an offer tomorrow — by then the competitor has already responded." },
        2: { title: 'Lost leads after hours', description: 'More than half of inquiries come in the evening and on weekends — most go unanswered.' },
        3: { title: 'Repetitive FAQ questions', description: 'The same questions about auto insurance, GO, CASCO — from every new client.' },
      },
    },
    solutions: {
      badge: 'What we solve with AI',
      heading: 'An AI stack for the broker business.',
      items: {
        0: { title: 'AI assistant for policy comparison', description: 'You upload the terms, AI compares them and surfaces differences — in seconds, not hours.' },
        1: { title: 'Automated quotes', description: 'Customer fills a form, AI generates a personalized quote and sends it via email/SMS in minutes.' },
        2: { title: 'Bulgarian AI chatbot 24/7', description: 'Answers typical questions, qualifies the lead, and delivers ready customers by morning.' },
        3: { title: 'Automated renewal reminders', description: 'SMS/email reminders before policy expiry — retains clients without manual tracking.' },
      },
    },
    proof: {
      badge: 'Real example',
      heading: 'SMS automation for an insurance broker.',
      description: 'We built a system that automatically sends renewal reminders before policies expire. It saves hours of manual work and improves renewal rate. Expanding with an AI assistant and online quote comparison is the natural next step for most brokers.',
      flag: '[REPLACE: confirm which broker is safe to name publicly (NDA check)]',
    },
    cta: {
      heading: 'Ready for 10+ hours saved per week?',
      description: "Free AI audit for brokers — we'll show you concretely where AI will deliver ROI in the next 3 months.",
      button: 'Free AI audit',
    },
  },
  ecommerce: {
    meta: {
      title: 'AI for e-commerce in Bulgaria - E&P Systems',
      description: 'AI descriptions, recommendations, and support for online stores. Boost conversion and AOV with an AI stack.',
    },
    hero: {
      badge: 'E-Commerce',
      heading: 'AI for online stores in Bulgaria.',
      subheading: '[REPLACE: expand this page after insurance wedge approval] Boost conversion, average order value, and reduce support load with an AI stack.',
    },
    problems: {
      badge: 'Problems',
      heading: 'Why many stores stall.',
      items: {
        0: { title: '[REPLACE: problem 1]', description: '[REPLACE: describe problem]' },
        1: { title: '[REPLACE: problem 2]', description: '[REPLACE: describe problem]' },
        2: { title: '[REPLACE: problem 3]', description: '[REPLACE: describe problem]' },
        3: { title: '[REPLACE: problem 4]', description: '[REPLACE: describe problem]' },
      },
    },
    solutions: {
      badge: 'What we solve',
      heading: 'AI stack for e-commerce.',
      items: {
        0: { title: '[REPLACE: solution 1]', description: '[REPLACE: describe solution]' },
        1: { title: '[REPLACE: solution 2]', description: '[REPLACE: describe solution]' },
        2: { title: '[REPLACE: solution 3]', description: '[REPLACE: describe solution]' },
        3: { title: '[REPLACE: solution 4]', description: '[REPLACE: describe solution]' },
      },
    },
    proof: {
      badge: 'Real example',
      heading: '[REPLACE: expand with InfinityStore case study]',
      description: '[REPLACE: describe real e-commerce project]',
      flag: '[REPLACE: expand this page once case studies are confirmed]',
    },
    cta: {
      heading: 'Ready for AI in your store?',
      description: "Free consultation — we'll show concretely what AI can do for your store.",
      button: 'Free consultation',
    },
  },
  fitness: {
    meta: {
      title: 'AI for fitness and sports in Bulgaria - E&P Systems',
      description: 'AI solutions for gyms, coaches, and sports businesses.',
    },
    hero: {
      badge: 'Fitness & Sports',
      heading: 'AI for fitness and sports businesses.',
      subheading: '[REPLACE: expand after ReflexGym case study confirmed] AI assistant for class booking, personalized programs, automated support.',
    },
    problems: {
      badge: 'Problems',
      heading: 'Why fitness businesses lose time.',
      items: {
        0: { title: '[REPLACE: problem 1]', description: '[REPLACE: describe problem]' },
        1: { title: '[REPLACE: problem 2]', description: '[REPLACE: describe problem]' },
        2: { title: '[REPLACE: problem 3]', description: '[REPLACE: describe problem]' },
        3: { title: '[REPLACE: problem 4]', description: '[REPLACE: describe problem]' },
      },
    },
    solutions: {
      badge: 'What we solve',
      heading: 'AI stack for fitness businesses.',
      items: {
        0: { title: '[REPLACE: solution 1]', description: '[REPLACE: describe solution]' },
        1: { title: '[REPLACE: solution 2]', description: '[REPLACE: describe solution]' },
        2: { title: '[REPLACE: solution 3]', description: '[REPLACE: describe solution]' },
        3: { title: '[REPLACE: solution 4]', description: '[REPLACE: describe solution]' },
      },
    },
    proof: {
      badge: 'Real example',
      heading: '[REPLACE: expand with ReflexGym case study]',
      description: '[REPLACE: describe real fitness project]',
      flag: '[REPLACE: expand once case studies are confirmed]',
    },
    cta: {
      heading: 'AI for your fitness business?',
      description: "Free consultation — we'll show where AI saves time and attracts more clients.",
      button: 'Free consultation',
    },
  },
}

// ----------------------------------------------------------------------------
function buildServicePages(pages) {
  const backKey = Object.keys(pages).length > 0 ? { backToServices: pages.backToServices || 'Всички услуги' } : {}
  const out = { backToServices: pages.backToServices || 'Всички услуги' }
  for (const slug of SLUGS) {
    out[slug] = pages[slug]
  }
  return out
}

function update(path, pagesContent, hubContent, industriesContent, backToServicesText) {
  const raw = readFileSync(path, 'utf8')
  const json = JSON.parse(raw)

  // Replace servicePages
  const sp = { backToServices: backToServicesText }
  for (const slug of SLUGS) sp[slug] = pagesContent[slug]
  json.servicePages = sp

  // Replace servicesHub
  json.servicesHub = hubContent

  // Add industries
  json.industries = industriesContent

  writeFileSync(path, JSON.stringify(json, null, 2) + '\n', 'utf8')
}

update(BG_PATH, bgPages, bgServicesHub, bgIndustries, 'Всички услуги')
update(EN_PATH, enPages, enServicesHub, enIndustries, 'All services')

console.log('Phase 4 locale update complete.')
