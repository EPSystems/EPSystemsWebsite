// One-shot: expand the two industry stubs (/industries/ecommerce and
// /industries/fitness) with real problem/solution/proof content.
// Modelled on the existing /industries/insurance wedge.
// Safe to delete after merge.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BG = resolve(__dirname, '../src/i18n/locales/bg/common.json')
const EN = resolve(__dirname, '../src/i18n/locales/en/common.json')

// -------- BG content --------
const bgEcommerce = {
  meta: {
    title: 'AI за онлайн магазини в България - E&P Systems',
    description:
      'AI описания, препоръки и 24/7 поддръжка за e-commerce. Повишете AOV, намалете support товара и мащабирайте каталога си с AI стек.',
  },
  hero: {
    badge: 'E-Commerce',
    heading: 'AI за онлайн магазини в България.',
    subheading:
      'Повишете средната стойност на поръчката, намалете товара върху support екипа и публикувайте уникални описания за стотици продукти - без да увеличавате екипа.',
  },
  problems: {
    badge: 'Проблемите, които познавате',
    heading: 'Защо много онлайн магазини буксуват.',
    items: {
      0: {
        title: 'Ръчно писане на продуктови описания',
        description:
          'С 500+ артикула, написването на уникални описания за всеки е почти невъзможно - повечето магазини копират производителските текстове, което убива SEO.',
      },
      1: {
        title: 'Повтарящи се support запитвания',
        description:
          '„Къде е поръчката ми?", „Имате ли размер M в наличност?", „Как връщам?" - едни и същи въпроси денонощно, често след работно време.',
      },
      2: {
        title: 'Ниска средна стойност на поръчката',
        description:
          'Клиентите не откриват свързани или допълващи продукти. Една поръчка = един артикул, вместо кошница с 2-3.',
      },
      3: {
        title: 'Слабо органично класиране',
        description:
          'Дубликатни описания, слаби категорийни страници, липса на long-tail съдържание - Google не праща трафик, плащате за реклами.',
      },
    },
  },
  solutions: {
    badge: 'Какво решаваме с AI',
    heading: 'AI стек за e-commerce, който реално работи.',
    items: {
      0: {
        title: 'AI продуктови описания с контрол на качеството',
        description:
          'Уникални, SEO оптимизирани описания за стотици артикули - за дни, не месеци. Human review гарантира тона на гласа на бранда.',
      },
      1: {
        title: 'AI customer support 24/7',
        description:
          'AI агент отговаря на 70%+ от запитванията автоматично - статус на поръчки, наличност, размери, връщания. Сложните случаи отиват към човек с контекст.',
      },
      2: {
        title: 'Персонализирани препоръки в реално време',
        description:
          'AI анализира поведението и препоръчва свързани продукти - типично повишава average order value с 15-30% без допълнителен маркетинг бюджет.',
      },
      3: {
        title: 'Programmatic SEO за категорийни страници',
        description:
          'Автоматично генериране на уникално съдържание за всяка категория и long-tail филтър - покрива keywords, които иначе пропускате.',
      },
    },
  },
  proof: {
    badge: 'Реален пример',
    heading: 'InfinityStore - напълно персонализиран e-commerce.',
    description:
      'Изградихме онлайн магазин, пригоден до най-малкия детайл към бранда на клиента - изчистен дизайн, гладко плащане, интеграции с локални доставчици. Базата е готова за AI слой - описания, препоръки и 24/7 поддръжка - когато собственикът е готов да мащабира.',
    flag: '',
  },
  cta: {
    heading: 'Готови ли сте за магазин, който продава сам?',
    description:
      'Безплатна консултация - ще препоръчаме правилната комбинация от платформа, интеграции и AI функции за вашия каталог и обем.',
    button: 'Безплатна AI консултация',
  },
}

const bgFitness = {
  meta: {
    title: 'AI за фитнес и спорт в България - E&P Systems',
    description:
      'AI booking асистент, автоматизирани напомняния и персонализирани програми за фитнес клубове и треньори.',
  },
  hero: {
    badge: 'Фитнес & Спорт',
    heading: 'AI за фитнес и спортни бизнеси.',
    subheading:
      'Записване на часове 24/7, автоматизирани напомняния, персонализирани програми и ранно предупреждение за клиенти, които започват да отпадат.',
  },
  problems: {
    badge: 'Проблемите, които познавате',
    heading: 'Защо фитнес бизнесът губи време и клиенти.',
    items: {
      0: {
        title: 'Ръчно управление на графика',
        description:
          'Рецепцията харчи часове на обаждания за записване, преместване, отмяна на часове - време, което не отива за реални клиенти.',
      },
      1: {
        title: 'Клиенти, които пропускат тренировки',
        description:
          'Без проактивни напомняния, no-show процентът расте. Загубен слот = пропусната възможност да бъде продаден на чакащ член.',
      },
      2: {
        title: 'Стандартни тренировъчни програми',
        description:
          'Ръчно писане на индивидуални програми не мащабира. Повечето клиенти получават един и същ шаблон, което намалява резултатите и задържането.',
      },
      3: {
        title: 'Тихо отпадащи членове',
        description:
          'Клиентите не идват 2 седмици, после 3, после отменят абонамента. Без ранно предупреждение няма шанс да ги върнете навреме.',
      },
    },
  },
  solutions: {
    badge: 'Какво решаваме с AI',
    heading: 'AI стек за фитнес бизнеса.',
    items: {
      0: {
        title: 'AI booking асистент 24/7',
        description:
          'Клиентите записват, променят и отменят часове чрез Messenger, WhatsApp или сайт чат - без да звънят на рецепцията. Календарът се актуализира автоматично.',
      },
      1: {
        title: 'Автоматизирани напомняния и re-engagement',
        description:
          'SMS/имейл напомняния 24 часа преди тренировка плюс re-engagement кампании за членове, които не са идвали повече от 14 дни.',
      },
      2: {
        title: 'AI персонализирани програми',
        description:
          'AI генерира тренировъчни програми, базирани на целите, нивото и историята на клиента - треньорът ги преглежда и одобрява, вместо да ги пише от нулата.',
      },
      3: {
        title: 'Churn prediction',
        description:
          'AI следи моделите на посещения и маркира клиенти с риск да отпаднат - преди да отменят абонамента. Време да се свържете проактивно.',
      },
    },
  },
  proof: {
    badge: 'Реален пример',
    heading: 'Сайт + операции за софийски фитнес клуб.',
    description:
      'Изградихме дигиталното присъствие и онлайн потока за локален фитнес бизнес - от witryna до автоматизирани потоци за запитвания. Стекът е готов за AI разширения: booking асистент, напомняния и персонализирани програми - когато клубът реши да направи следващата стъпка.',
    flag: '',
  },
  cta: {
    heading: 'AI за вашия фитнес бизнес?',
    description:
      'Безплатна консултация - ще покажем кои AI функции ще спестят най-много време и ще задържат най-много клиенти във вашия конкретен бизнес.',
    button: 'Безплатна AI консултация',
  },
}

// -------- EN content --------
const enEcommerce = {
  meta: {
    title: 'AI for online stores in Bulgaria - E&P Systems',
    description:
      'AI descriptions, recommendations, and 24/7 support for e-commerce. Raise AOV, reduce support load, and scale your catalog with an AI stack.',
  },
  hero: {
    badge: 'E-Commerce',
    heading: 'AI for online stores in Bulgaria.',
    subheading:
      'Raise average order value, reduce support load, and publish unique descriptions for hundreds of products — without growing your team.',
  },
  problems: {
    badge: 'Problems you know',
    heading: 'Why many online stores stall.',
    items: {
      0: {
        title: 'Manual product descriptions',
        description:
          "With 500+ items, writing unique descriptions for each is near impossible — most stores copy manufacturer text, which kills SEO.",
      },
      1: {
        title: 'Repetitive support inquiries',
        description:
          '"Where is my order?", "Do you have size M in stock?", "How do I return?" — the same questions around the clock, often after hours.',
      },
      2: {
        title: 'Low average order value',
        description:
          "Customers don't discover related or complementary products. One order = one item, instead of a basket of 2-3.",
      },
      3: {
        title: 'Weak organic rankings',
        description:
          "Duplicate descriptions, thin category pages, no long-tail content — Google sends no traffic and you pay for ads.",
      },
    },
  },
  solutions: {
    badge: 'What we solve with AI',
    heading: 'An AI stack for e-commerce that actually works.',
    items: {
      0: {
        title: 'AI product descriptions with quality control',
        description:
          "Unique, SEO-optimized descriptions for hundreds of items — in days, not months. Human review keeps the brand voice intact.",
      },
      1: {
        title: '24/7 AI customer support',
        description:
          'An AI agent handles 70%+ of inquiries automatically — order status, stock, sizes, returns. Complex cases go to a human with context.',
      },
      2: {
        title: 'Real-time personalized recommendations',
        description:
          'AI analyzes behavior and suggests related products — typically lifts average order value by 15-30% without extra marketing spend.',
      },
      3: {
        title: 'Programmatic SEO for category pages',
        description:
          'Automatic unique content for every category and long-tail filter — covers keywords you would otherwise miss.',
      },
    },
  },
  proof: {
    badge: 'Real example',
    heading: 'InfinityStore — fully custom e-commerce.',
    description:
      "We built an online store tailored to the smallest detail of the client's brand — clean design, smooth checkout, integrations with local delivery providers. The foundation is ready for the AI layer — descriptions, recommendations, and 24/7 support — whenever the owner is ready to scale.",
    flag: '',
  },
  cta: {
    heading: 'Ready for a store that sells on its own?',
    description:
      "Free consultation — we'll recommend the right combination of platform, integrations, and AI features for your catalog and volume.",
    button: 'Free AI consultation',
  },
}

const enFitness = {
  meta: {
    title: 'AI for fitness and sports in Bulgaria - E&P Systems',
    description:
      'AI booking assistant, automated reminders, and personalized programs for gyms and coaches.',
  },
  hero: {
    badge: 'Fitness & Sports',
    heading: 'AI for fitness and sports businesses.',
    subheading:
      '24/7 class booking, automated reminders, personalized programs, and early warning for members who are about to drop off.',
  },
  problems: {
    badge: 'Problems you know',
    heading: 'Why fitness businesses lose time and customers.',
    items: {
      0: {
        title: 'Manual schedule management',
        description:
          "The front desk spends hours on calls — booking, rescheduling, canceling — time that isn't going to real clients.",
      },
      1: {
        title: 'Members who skip sessions',
        description:
          'Without proactive reminders, no-show rates climb. A missed slot = a lost chance to sell to a waiting member.',
      },
      2: {
        title: 'One-size-fits-all training plans',
        description:
          'Writing individual programs manually does not scale. Most clients get the same template, which hurts results and retention.',
      },
      3: {
        title: 'Silent member churn',
        description:
          'Clients skip 2 weeks, then 3, then cancel the membership. Without early warning you have no chance to win them back in time.',
      },
    },
  },
  solutions: {
    badge: 'What we solve with AI',
    heading: 'An AI stack for fitness businesses.',
    items: {
      0: {
        title: '24/7 AI booking assistant',
        description:
          "Clients book, reschedule, and cancel via Messenger, WhatsApp, or site chat — no calls to the front desk. The calendar updates itself.",
      },
      1: {
        title: 'Automated reminders and re-engagement',
        description:
          'SMS/email reminders 24 hours before a class, plus re-engagement campaigns for members who have not shown up for 14+ days.',
      },
      2: {
        title: 'AI personalized programs',
        description:
          "AI generates training plans based on the client's goals, level, and history — the coach reviews and approves, instead of writing from scratch.",
      },
      3: {
        title: 'Churn prediction',
        description:
          'AI watches attendance patterns and flags members at risk of dropping off — before they cancel. Time to reach out proactively.',
      },
    },
  },
  proof: {
    badge: 'Real example',
    heading: 'Website + operations for a Sofia fitness club.',
    description:
      'We built the digital presence and inquiry flow for a local fitness business — from the storefront to automated lead routing. The stack is ready for AI extensions: booking assistant, reminders, and personalized programs — whenever the club decides to take the next step.',
    flag: '',
  },
  cta: {
    heading: 'AI for your fitness business?',
    description:
      "Free consultation — we'll show which AI features will save the most time and retain the most members in your specific business.",
    button: 'Free AI consultation',
  },
}

function apply(path, ecommerce, fitness) {
  const json = JSON.parse(readFileSync(path, 'utf8'))
  json.industries.ecommerce = ecommerce
  json.industries.fitness = fitness
  writeFileSync(path, JSON.stringify(json, null, 2) + '\n', 'utf8')
}

apply(BG, bgEcommerce, bgFitness)
apply(EN, enEcommerce, enFitness)
console.log('Expanded /industries/ecommerce and /industries/fitness in BG + EN.')
