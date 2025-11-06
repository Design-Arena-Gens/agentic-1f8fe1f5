import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

const ROOT = process.cwd();
const PUBLIC_BOOK_DIR = path.join(ROOT, "public", "books");
const DATA_FILE = path.join(ROOT, "data", "books.json");

const TOTAL_BOOKS = 500;

const genres = [
  "Artificial Intelligence",
  "Machine Learning",
  "Quantum Computing",
  "Cybersecurity",
  "Climate Science",
  "Global Health",
  "Cultural Studies",
  "Philosophy",
  "Astronomy",
  "Neuroscience",
  "Digital Art",
  "Renewable Energy",
  "Urban Planning",
  "Education",
  "Economics",
  "Linguistics",
  "Anthropology",
  "History",
  "Political Science",
  "Sociology",
  "Biotechnology",
  "Ecology",
  "Psychology",
  "Robotics",
  "Data Science"
];

const locales = [
  { code: "en", voice: "en-US", name: "English" },
  { code: "es", voice: "es-ES", name: "Español" },
  { code: "fr", voice: "fr-FR", name: "Français" },
  { code: "de", voice: "de-DE", name: "Deutsch" },
  { code: "zh", voice: "zh-CN", name: "中文" },
  { code: "ar", voice: "ar-SA", name: "العربية" },
  { code: "hi", voice: "hi-IN", name: "हिन्दी" },
  { code: "pt", voice: "pt-BR", name: "Português" },
  { code: "ru", voice: "ru-RU", name: "Русский" },
  { code: "ja", voice: "ja-JP", name: "日本語" }
];

const authorFirstNames = [
  "Amina",
  "Liam",
  "Chen",
  "Sofia",
  "Mateo",
  "Priya",
  "Noah",
  "Fatima",
  "Ethan",
  "Yara",
  "Aya",
  "Hasan",
  "Greta",
  "Jonah",
  "Lucia",
  "Naomi",
  "Elena",
  "Ravi",
  "Kai",
  "Mira",
  "Dara",
  "Sven",
  "Malik",
  "Anika",
  "Omar"
];

const authorLastNames = [
  "Alvarez",
  "Yamada",
  "Okafor",
  "Singh",
  "Chen",
  "Rahman",
  "Hassan",
  "Benitez",
  "Kaur",
  "Nielsen",
  "Hughes",
  "Ibrahim",
  "Müller",
  "Silva",
  "Tran",
  "Diallo",
  "Kowalski",
  "Hernandez",
  "Bianchi",
  "Petrov",
  "Sato",
  "Nguyen",
  "Adeyemi",
  "Dubois",
  "Martinez"
];

const thematicPhrases = [
  "bridges theory with global case studies",
  "provides hands-on frameworks for practitioners",
  "documents resilient community responses",
  "analyzes ethical dilemmas in emerging tech",
  "maps intergenerational knowledge systems",
  "explores multilingual communication patterns",
  "compares policy approaches across continents",
  "elevates voices from underrepresented regions",
  "translates complex data into actionable plans",
  "celebrates creative collaborations across cultures"
];

interface BookRecord {
  id: string;
  title: string;
  author: string;
  genre: string;
  summary: string;
  synopsis: string;
  topics: string[];
  pdfUrl: string;
  coverColor: string;
  language: string;
  languageName: string;
  voiceLocale: string;
  published: number;
  pages: number;
  globalRegions: string[];
  summaries: Record<string, string>;
}

const coverPalette = [
  "#0b6caa",
  "#178ed7",
  "#1fb6ff",
  "#16a34a",
  "#f97316",
  "#ef4444",
  "#9333ea",
  "#4f46e5",
  "#0ea5e9",
  "#14b8a6"
];

async function ensureDirectories() {
  await fs.promises.mkdir(PUBLIC_BOOK_DIR, { recursive: true });
  await fs.promises.mkdir(path.dirname(DATA_FILE), { recursive: true });
}

function randomItem<T>(arr: T[], index: number): T {
  return arr[index % arr.length];
}

function buildTitle(index: number, genre: string): string {
  const prefixes = ["Atlas", "Guide", "Voyage", "Blueprint", "Narrative", "Companion", "Anthology", "Synthesis", "Compendium", "Rhythm"];
  const suffixes = ["for a Shared Future", "of Resilient Cities", "of Planetary Care", "for Open Knowledge", "of Connected Minds", "for Emerging Leaders", "of Regenerative Systems", "for Learning Together", "of Civic Imagination", "for Equitable Innovation"];

  const prefix = randomItem(prefixes, index);
  const suffix = randomItem(suffixes, index + 7);

  return `${genre} ${prefix} ${suffix}`;
}

function buildTopics(genre: string, idx: number): string[] {
  const globalRegions = ["Africa", "Asia", "Europe", "South America", "North America", "Oceania", "Middle East", "Arctic"];
  const methodologies = ["participatory research", "data storytelling", "systems thinking", "policy prototyping", "community science", "human-centered design", "immersive learning", "digital twins"];

  return [
    genre,
    randomItem(globalRegions, idx),
    randomItem(methodologies, idx + 13)
  ];
}

function buildSummary(title: string, genre: string, phrase: string, region: string): string {
  return `${title} is a deep exploration of ${genre.toLowerCase()} that ${phrase}. It highlights collaborations across ${region} and invites readers to co-create solutions with accessible exercises.`;
}

function buildSynopsis(title: string, genre: string, topics: string[], phrase: string): string {
  return [
    `${title} invites readers into a cross-border dialogue on ${genre.toLowerCase()} innovation.`,
    `Across eight chapters, it connects ${topics[1]} initiatives with practical toolkits for ${topics[2]}.`,
    `The narrative centers community wisdom, weaving interviews, field notes, and multimedia resources into a cohesive roadmap.`,
    `Readers gain actionable strategies to launch collaborative projects, assess impact, and sustain inclusive governance.`,
    `An annotated appendix curates open datasets, multilingual glossaries, and reflective prompts for lifelong learning.`
  ].join(" ");
}

function buildMultilingualSummaries(title: string, genre: string, region: string): Record<string, string> {
  const lowerGenre = genre.toLowerCase();

  return {
    en: `${title} invites global readers to reimagine ${lowerGenre} through community-led experiments anchored in ${region}. Practical briefs and reflective prompts make the journey accessible for collaborative teams.`,
    es: `"${title}" invita a lectores de todo el mundo a reinventar ${lowerGenre} mediante experimentos dirigidos por la comunidad en ${region}. Incluye guías prácticas y preguntas de reflexión para equipos colaborativos.`,
    fr: `« ${title} » convie les lecteurs du monde entier à repenser ${lowerGenre} grâce à des expériences menées par les communautés de ${region}. Des fiches pratiques et des pistes de réflexion accompagnent chaque chapitre.`,
    de: `„${title}“ lädt Leserinnen und Leser weltweit ein, ${lowerGenre} mit gemeinschaftlichen Projekten aus ${region} neu zu denken. Praxisleitfäden und Reflexionsfragen unterstützen Teams Schritt für Schritt.`,
    zh: `《${title}》通过来自${region}的社区实践，邀请全球读者重新想象${lowerGenre}。书中提供实践指南与反思提示，帮助团队共同前进。`,
    ar: `«${title}» يدعو القرّاء حول العالم إلى إعادة تخيل مجال ${lowerGenre} من خلال مبادرات تقودها المجتمعات في ${region}. يتضمن الكتاب أدلة عملية وأسئلة للتأمل تدعم الفرق التعاونية.`,
    hi: `"${title}" दुनिया भर के पाठकों को ${region} की सामुदायिक पहलों के माध्यम से ${lowerGenre} को नए तरीके से समझने का आमंत्रण देता है। पुस्तक में व्यावहारिक मार्गदर्शिकाएँ और चिंतन बिंदु शामिल हैं जो टीमों को साथ काम करने में सहायक हैं।`,
    pt: `"${title}" convida leitores do mundo inteiro a reinventar ${lowerGenre} com iniciativas lideradas pela comunidade em ${region}. Guias práticos e perguntas de reflexão apoiam equipes colaborativas.`,
    ru: `«${title}» приглашает читателей по всему миру заново осмыслить сферу ${lowerGenre} через инициативы сообществ из региона ${region}. Практические рекомендации и вопросы для размышлений помогают командам работать вместе.`,
    ja: `『${title}』は、${region} のコミュニティ主導の取り組みを通して ${lowerGenre} を再構築する旅へ世界の読者を招待します。各章には実践ガイドと振り返りの問いが用意されています。`
  };
}

async function createPdf(filePath: string, record: BookRecord): Promise<void> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "LETTER", margin: 56 });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    doc.fillColor("#0b6caa").fontSize(24).text(record.title, { align: "center" });
    doc.moveDown();
    doc.fillColor("#0c3853").fontSize(16).text(`Author: ${record.author}`);
    doc.moveDown();
    doc.fontSize(12).text(`Published: ${record.published} • Pages: ${record.pages}`);
    doc.moveDown();
    doc.fillColor("#111827").fontSize(12).text(record.summary, { align: "left" });
    doc.moveDown();
    doc.text(record.synopsis, { align: "left" });
    doc.moveDown();
    doc.fillColor("#0b6caa").text(`Key Topics: ${record.topics.join(", ")}`);
    doc.addPage();
    doc.fillColor("#111827").fontSize(12).text(`Global Regions: ${record.globalRegions.join(", ")}`);
    doc.moveDown();
    doc.text(`Language Focus: ${record.languageName}`);
    doc.moveDown();
    doc.text(
      `This edition celebrates multilingual learning. Passages include community spotlights translated into ${record.languageName} to ensure accessibility for diverse readers.`
    );
    doc.end();

    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

async function generate(): Promise<void> {
  await ensureDirectories();

  const records: BookRecord[] = [];

  const regionSets = [
    ["West Africa", "Caribbean", "Nordic"],
    ["Andes", "Arabian Peninsula", "Mediterranean"],
    ["Baltic", "Pacific Islands", "Great Lakes"],
    ["Indus Valley", "Sahel", "Himalayas"],
    ["Coral Triangle", "Danube", "Maghreb"],
    ["Patagonia", "Baltics", "Red Sea"],
    ["Gulf of Guinea", "Appalachia", "Caucasus"],
    ["Malay Archipelago", "Black Sea", "Great Barrier Reef"]
  ];

  const jobs: Promise<void>[] = [];

  for (let i = 1; i <= TOTAL_BOOKS; i += 1) {
    const genre = randomItem(genres, i);
    const author = `${randomItem(authorFirstNames, i)} ${randomItem(authorLastNames, i * 3)}`;
    const title = buildTitle(i, genre);
    const topics = buildTopics(genre, i);
    const phrase = randomItem(thematicPhrases, i * 5);
    const region = topics[1];
    const summary = buildSummary(title, genre, phrase, region);
    const synopsis = buildSynopsis(title, genre, topics, phrase);
    const locale = randomItem(locales, i);
    const coverColor = randomItem(coverPalette, i * 7);
    const published = 1995 + (i % 28);
    const pages = 160 + (i % 180);
    const globalRegions = randomItem(regionSets, i).slice();

    const id = `book-${i.toString().padStart(3, "0")}`;
    const pdfUrl = `/books/${id}.pdf`;

    const summaries = buildMultilingualSummaries(title, genre, region);

    const record: BookRecord = {
      id,
      title,
      author,
      genre,
      summary,
      synopsis,
      topics,
      pdfUrl,
      coverColor,
      language: locale.code,
      languageName: locale.name,
      voiceLocale: locale.voice,
      published,
      pages,
      globalRegions,
      summaries
    };

    records.push(record);

    const filePath = path.join(PUBLIC_BOOK_DIR, `${id}.pdf`);
    const job = createPdf(filePath, record);
    jobs.push(job);
  }

  await Promise.all(jobs);
  await fs.promises.writeFile(DATA_FILE, JSON.stringify(records, null, 2), "utf8");
  console.log(`Generated ${TOTAL_BOOKS} book records and PDFs.`);
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
