"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import type { BookRecord } from "@/lib/types";
import { BookCard } from "./BookCard";
import { BookDetailDrawer } from "./BookDetailDrawer";
import { LanguagePicker } from "./LanguagePicker";
import classNames from "classnames";

interface BookExplorerProps {
  initialBooks: BookRecord[];
  totalBooks: number;
  genres: string[];
}

interface BooksResponse {
  data: BookRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

async function fetchBooks(params: Record<string, string | number | null | undefined>): Promise<BooksResponse> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).length > 0) {
      searchParams.append(key, String(value));
    }
  });

  const response = await fetch(`/api/books?${searchParams.toString()}`, {
    method: "GET",
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Failed to load books");
  }

  return response.json();
}

export function BookExplorer({ initialBooks, totalBooks, genres }: BookExplorerProps) {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>("en");
  const [page, setPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState<BookRecord | null>(null);

  const pageSize = 24;

  const { data, isFetching } = useQuery({
    queryKey: ["books", { query, genre, language, page, pageSize }],
    queryFn: () =>
      fetchBooks({
        q: query,
        genre: genre ?? undefined,
        language: language ?? undefined,
        page,
        pageSize
      }),
    initialData: {
      data: initialBooks,
      total: totalBooks,
      page: 1,
      pageSize,
      totalPages: Math.ceil(totalBooks / pageSize)
    }
  });

  const total = data?.total ?? totalBooks;
  const totalPages = data?.totalPages ?? Math.ceil(totalBooks / pageSize);
  const books = data?.data ?? initialBooks;

  const genreOptions = useMemo(() => {
    return ["All", ...genres];
  }, [genres]);

  const showLoadingIndicator =
    isFetching && (page !== 1 || query.trim().length > 0 || genre !== null || language !== "en");

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setPage(1);
  };

  const handleGenreChange = (value: string) => {
    setGenre(value === "All" ? null : value);
    setPage(1);
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    setPage(1);
  };

  const handleNextPage = () => {
    setPage((current) => Math.min(current + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setPage((current) => Math.max(current - 1, 1));
  };

  return (
    <section className="mt-12 rounded-3xl border border-ocean-100 bg-white p-8 shadow-lg">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold text-ocean-900">Explore 500 Open Access Books</h2>
          <p className="mt-2 text-sm text-ocean-600">
            Browse multilingual research, community toolkits, and creative anthologies curated for global learners.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 lg:w-auto">
          <div className="relative flex h-12 items-center rounded-full border border-ocean-200 bg-ocean-50/40">
            <MagnifyingGlassIcon className="ml-4 h-5 w-5 text-ocean-400" />
            <input
              value={query}
              onChange={handleQueryChange}
              placeholder="Search by topic, author, or region"
              className="h-full flex-1 rounded-full border-0 bg-transparent pl-3 pr-4 text-sm text-ocean-800 placeholder:text-ocean-400 focus:outline-none"
            />
            {showLoadingIndicator ? (
              <span className="mr-4 text-xs text-ocean-400">Loading…</span>
            ) : null}
          </div>
          <LanguagePicker value={language} onChange={handleLanguageChange} />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {genreOptions.map((option) => {
          const selected = (genre ?? "All") === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => handleGenreChange(option)}
              className={classNames(
                "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition",
                selected
                  ? "border-ocean-500 bg-ocean-100 text-ocean-700"
                  : "border-ocean-200 bg-white text-ocean-500 hover:border-ocean-400 hover:text-ocean-700"
              )}
            >
              {option}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {books.map((book) => (
          <BookCard key={book.id} book={book} onSelect={setSelectedBook} />
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-ocean-100 pt-6 text-sm text-ocean-600 lg:flex-row">
        <p>
          Showing {books.length} of {total} titles.
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePreviousPage}
            disabled={page === 1}
            className="rounded-full border border-ocean-200 px-4 py-2 font-medium text-ocean-500 transition hover:border-ocean-400 hover:text-ocean-700 disabled:cursor-not-allowed disabled:border-ocean-100 disabled:text-ocean-300"
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="rounded-full border border-ocean-200 px-4 py-2 font-medium text-ocean-500 transition hover:border-ocean-400 hover:text-ocean-700 disabled:cursor-not-allowed disabled:border-ocean-100 disabled:text-ocean-300"
          >
            Next
          </button>
        </div>
      </div>

      <BookDetailDrawer book={selectedBook} onClose={() => setSelectedBook(null)} />
    </section>
  );
}
