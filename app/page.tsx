import { getBooks, getFeaturedBooks } from "@/lib/books";
import { BookExplorer } from "@/components/BookExplorer";
import { ChatSection } from "@/components/ChatSection";

export default function HomePage() {
  const allBooks = getBooks();
  const featured = getFeaturedBooks(24);
  const genres = Array.from(new Set(allBooks.map((book) => book.genre))).sort();

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-12">
      <header className="rounded-3xl border border-ocean-100 bg-gradient-to-br from-ocean-500/10 via-white to-ocean-100/60 p-10 shadow-lg">
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex items-center rounded-full bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-ocean-500 shadow-sm">
            Global Knowledge Commons
          </span>
          <h1 className="text-4xl font-semibold text-ocean-900 md:text-5xl">
            Browse, question, and listen to insights from 500 multilingual open-access books.
          </h1>
          <p className="text-lg text-ocean-700">
            Discover field guides, research anthologies, and community playbooks curated for planetary problem solvers. Ask the AI
            librarian anything—answers arrive in your language with cited PDFs and optional voice narration.
          </p>
        </div>
      </header>

      <BookExplorer initialBooks={featured} totalBooks={allBooks.length} genres={genres} />
      <ChatSection />
    </main>
  );
}
