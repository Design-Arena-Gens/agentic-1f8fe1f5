"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MicrophoneIcon, SpeakerWaveIcon } from "@heroicons/react/24/outline";
import { findLanguageOption } from "@/lib/languages";

interface VoiceAgentControlsProps {
  text: string;
  language: string;
  onTranscript: (text: string) => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item: (index: number) => SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item: (index: number) => SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export function VoiceAgentControls({ text, language, onTranscript }: VoiceAgentControlsProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const languageOption = useMemo(() => findLanguageOption(language) ?? findLanguageOption("en"), [language]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    const synth = window.speechSynthesis;

    function populateVoices() {
      const available = synth.getVoices();
      setVoices(available);
    }

    populateVoices();
    synth.addEventListener?.("voiceschanged", populateVoices);

    return () => {
      synth.removeEventListener?.("voiceschanged", populateVoices);
    };
  }, []);

  const speak = () => {
    if (typeof window === "undefined" || !text.trim()) {
      return;
    }

    const synth = window.speechSynthesis;
    if (!synth) {
      return;
    }

    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const targetLocale = languageOption?.voiceLocale ?? "en-US";
    const selectedVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith(targetLocale.toLowerCase()));
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.lang = targetLocale;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synth.speak(utterance);
  };

  const initRecognition = () => {
    if (typeof window === "undefined") {
      return null;
    }
    const ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!ctor) {
      return null;
    }
    const recognition = new ctor();
    recognition.lang = languageOption?.voiceLocale ?? "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[0];
      const alternative = result[0];
      if (alternative?.transcript) {
        onTranscript(alternative.transcript);
      }
    };
    recognition.onerror = () => {
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    return recognition;
  };

  const startListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = initRecognition();
    if (!recognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={speak}
        disabled={!text.trim()}
        className="inline-flex items-center gap-2 rounded-full bg-ocean-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-ocean-600 disabled:cursor-not-allowed disabled:bg-ocean-200"
      >
        <SpeakerWaveIcon className="h-5 w-5" />
        {isSpeaking ? "Speaking…" : "Speak Answer"}
      </button>
      <button
        type="button"
        onClick={startListening}
        className="inline-flex items-center gap-2 rounded-full border border-ocean-300 px-4 py-2 text-sm font-semibold text-ocean-600 transition hover:border-ocean-500 hover:text-ocean-800"
      >
        <MicrophoneIcon className="h-5 w-5" />
        {isListening ? "Listening…" : "Voice Ask"}
      </button>
    </div>
  );
}
