"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import type { BookRecord } from "@/lib/types";

interface BookDetailDrawerProps {
  book: BookRecord | null;
  onClose: () => void;
}

export function BookDetailDrawer({ book, onClose }: BookDetailDrawerProps) {
  return (
    <Transition.Root show={Boolean(book)} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-ocean-900/40 backdrop-blur" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-6">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl bg-white shadow-xl">
                  {book ? (
                    <div className="flex h-full flex-col">
                      <div className="flex items-start justify-between border-b border-ocean-100 p-6">
                        <div>
                          <Dialog.Title className="text-2xl font-semibold text-ocean-900">
                            {book.title}
                          </Dialog.Title>
                          <p className="mt-1 text-sm text-ocean-600">
                            {book.author} • {book.genre} • {book.languageName}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="rounded-full border border-transparent bg-ocean-50 px-3 py-1 text-sm text-ocean-600 hover:bg-ocean-100"
                          onClick={onClose}
                        >
                          Close
                        </button>
                      </div>
                      <div className="flex-1 overflow-y-auto p-6 text-sm text-ocean-700">
                        <section className="space-y-4">
                          <p className="font-semibold uppercase tracking-wide text-ocean-500">Synopsis</p>
                          <p>{book.synopsis}</p>
                          <div>
                            <p className="font-semibold uppercase tracking-wide text-ocean-500">Focus Regions</p>
                            <p>{book.globalRegions.join(", ")}</p>
                          </div>
                          <div>
                            <p className="font-semibold uppercase tracking-wide text-ocean-500">Chapters in {book.languageName}</p>
                            <p>{book.summaries[book.language] ?? book.summary}</p>
                          </div>
                        </section>
                      </div>
                      <div className="border-t border-ocean-100 p-6">
                        <a
                          href={book.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-full bg-ocean-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-ocean-600"
                        >
                          Read Full PDF
                        </a>
                      </div>
                    </div>
                  ) : null}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
