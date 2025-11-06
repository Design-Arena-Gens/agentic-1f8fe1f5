"use client";

import { LANGUAGE_OPTIONS } from "@/lib/languages";
import classNames from "classnames";

interface LanguagePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function LanguagePicker({ value, onChange }: LanguagePickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {LANGUAGE_OPTIONS.map((option) => {
        const selected = option.code === value;
        return (
          <button
            key={option.code}
            type="button"
            onClick={() => onChange(option.code)}
            className={classNames(
              "rounded-full border px-3 py-1 text-sm transition-all",
              selected
                ? "border-ocean-600 bg-ocean-100 text-ocean-800 shadow"
                : "border-ocean-200 bg-white text-ocean-600 hover:border-ocean-400"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
