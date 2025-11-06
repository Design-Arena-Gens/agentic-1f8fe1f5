import type { BookRecord } from "@/lib/types";

interface BookCardProps {
  book: BookRecord;
  onSelect?: (book: BookRecord) => void;
}

export function BookCard({ book, onSelect }: BookCardProps) {
  return (
    <article
      className="flex flex-col justify-between rounded-2xl border border-ocean-100 bg-white p-5 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md"
      style={{ borderTop: `6px solid ${book.coverColor}` }}
    >
      <div>
        <h3 className="text-lg font-semibold text-ocean-900">{book.title}</h3>
        <p className="mt-1 text-sm text-ocean-600">{book.author}</p>
        <p className="mt-3 line-clamp-3 text-sm text-ocean-700">{book.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-ocean-600">
          {book.topics.map((topic) => (
            <span
              key={topic}
              className="rounded-full bg-ocean-50 px-2 py-1 font-medium uppercase tracking-wide"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="text-ocean-500">
          <span>{book.genre}</span>
          <span className="mx-2">•</span>
          <span>{book.published}</span>
        </div>
        <div className="flex gap-2">
          <a
            href={book.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-ocean-500 px-4 py-2 font-semibold text-white transition hover:bg-ocean-600"
          >
            Open PDF
          </a>
          {onSelect ? (
            <button
              type="button"
              onClick={() => onSelect(book)}
              className="rounded-full border border-ocean-200 px-4 py-2 font-semibold text-ocean-600 transition hover:border-ocean-400 hover:text-ocean-800"
            >
              Details
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
