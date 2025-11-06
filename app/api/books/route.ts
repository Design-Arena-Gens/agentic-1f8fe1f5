import { NextResponse } from "next/server";
import { getBooks, searchBooks } from "@/lib/books";

const PAGE_SIZE_DEFAULT = 24;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const q = searchParams.get("q")?.trim() ?? "";
  const genre = searchParams.get("genre")?.trim().toLowerCase();
  const language = searchParams.get("language")?.trim().toLowerCase();
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10));
  const pageSize = Math.min(60, Math.max(6, Number.parseInt(searchParams.get("pageSize") ?? `${PAGE_SIZE_DEFAULT}`, 10)));

  let results = q ? searchBooks(q, 500) : getBooks();

  if (genre) {
    results = results.filter((book) => book.genre.toLowerCase() === genre);
  }

  if (language) {
    results = results.filter((book) => book.language.toLowerCase() === language);
  }

  const total = results.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const data = results.slice(start, end);

  return NextResponse.json({
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  });
}
