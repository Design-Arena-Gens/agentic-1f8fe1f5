"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import type { BookRecord, ChatMessage } from "@/lib/types";
import { LanguagePicker } from "./LanguagePicker";
import { VoiceAgentControls } from "./VoiceAgentControls";

interface ChatSectionProps {
  initialLanguage?: string;
}

export function ChatSection({ initialLanguage = "en" }: ChatSectionProps) {
  const [language, setLanguage] = useState(initialLanguage);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hello! I'm your AI librarian. Ask me about any topic and I'll surface books with multilingual highlights.",
      language: "en",
      createdAt: new Date().toISOString()
    }
  ]);
  const [sources, setSources] = useState<BookRecord[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const lastAssistantMessage = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (messages[i].role === "assistant") {
        return messages[i];
      }
    }
    return null;
  }, [messages]);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  };

  const submitQuestion = async (event?: FormEvent) => {
    event?.preventDefault();
    const question = input.trim();
    if (!question || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: question,
      language,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, language })
      });

      if (!response.ok) {
        throw new Error("Failed to reach AI librarian");
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: data.answer,
        language: data.language,
        createdAt: new Date().toISOString()
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setSources(data.sources as BookRecord[]);
      scrollToBottom();
    } catch (error) {
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: "I couldn't reach the knowledge base right now. Please try again shortly.",
        language: "en",
        createdAt: new Date().toISOString()
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranscript = (transcript: string) => {
    setInput(transcript);
    scrollToBottom();
  };

  return (
    <section className="mt-12 grid gap-6 lg:grid-cols-5 lg:items-start">
      <div className="lg:col-span-3 rounded-3xl border border-ocean-100 bg-white p-6 shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-ocean-900">Global AI Librarian</h2>
            <p className="text-sm text-ocean-600">
              Ask in your preferred language. The librarian responds with curated titles and can read answers aloud.
            </p>
          </div>
          <LanguagePicker value={language} onChange={setLanguage} />
        </div>

        <div
          ref={scrollRef}
          className="mt-6 max-h-[420px] space-y-4 overflow-y-auto rounded-2xl bg-ocean-50/60 p-6 text-sm shadow-inner"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={
                  message.role === "user"
                    ? "max-w-xl rounded-2xl bg-ocean-500 px-4 py-3 text-white"
                    : "max-w-xl rounded-2xl bg-white px-4 py-3 text-ocean-700 shadow"
                }
              >
                <p className="whitespace-pre-wrap">{message.text}</p>
                <span className="mt-2 block text-xs text-ocean-400">
                  {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={submitQuestion} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask for a topic, region, or skill you'd like to explore"
            className="h-24 flex-1 resize-none rounded-2xl border border-ocean-200 bg-white px-4 py-3 text-sm text-ocean-800 placeholder:text-ocean-400 focus:outline-none focus:ring-2 focus:ring-ocean-300"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-ocean-500 px-6 text-sm font-semibold text-white transition hover:bg-ocean-600 disabled:cursor-not-allowed disabled:bg-ocean-300"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
            {isLoading ? "Thinking…" : "Send"}
          </button>
        </form>

        <div className="mt-4">
          <VoiceAgentControls
            text={lastAssistantMessage?.text ?? ""}
            language={language}
            onTranscript={handleTranscript}
          />
        </div>
      </div>

      <aside className="lg:col-span-2 rounded-3xl border border-ocean-100 bg-white p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-ocean-900">Highlighted Sources</h3>
        <p className="mt-2 text-sm text-ocean-600">
          The librarian references books directly. Open any source to continue exploring and quote with confidence.
        </p>
        <div className="mt-4 space-y-4">
          {sources.length === 0 ? (
            <p className="rounded-2xl bg-ocean-50 px-4 py-3 text-sm text-ocean-500">
              Ask a question to surface relevant titles.
            </p>
          ) : (
            sources.map((book) => (
              <div key={book.id} className="rounded-2xl border border-ocean-100 bg-ocean-50 px-4 py-3 text-sm text-ocean-700">
                <p className="font-semibold text-ocean-800">{book.title}</p>
                <p>{book.author}</p>
                <p className="mt-2 text-xs text-ocean-500">
                  {book.genre} • {book.languageName}
                </p>
                <a
                  href={book.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-xs font-semibold text-ocean-600 hover:text-ocean-800"
                >
                  Open PDF →
                </a>
              </div>
            ))
          )}
        </div>
      </aside>
    </section>
  );
}
