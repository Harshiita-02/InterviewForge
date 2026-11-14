import { useCallback, useEffect, useRef, useState } from "react";

// Minimal types for the browser's speech recognition (TypeScript does not ship them)
interface RecognitionResult {
  isFinal: boolean;
  0: { transcript: string };
}

interface RecognitionEvent {
  resultIndex: number;
  results: ArrayLike<RecognitionResult>;
}

interface RecognitionErrorEvent {
  error: string;
}

interface Recognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: RecognitionEvent) => void) | null;
  onerror: ((event: RecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type RecognitionConstructor = new () => Recognition;

function getRecognitionConstructor(): RecognitionConstructor | null {
  const w = window as unknown as {
    SpeechRecognition?: RecognitionConstructor;
    webkitSpeechRecognition?: RecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

// Turns speech into text in the browser (Chrome and Edge). onText gets the full text so far.
export function useSpeechToText(onText: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const recognitionRef = useRef<Recognition | null>(null);
  const finalTextRef = useRef("");
  const onTextRef = useRef(onText);
  const supported = getRecognitionConstructor() !== null;

  useEffect(() => {
    onTextRef.current = onText;
  });

  // Stop listening if the component goes away
  useEffect(() => {
    return () => recognitionRef.current?.abort();
  }, []);

  const start = useCallback((existingText: string) => {
    const Recognition = getRecognitionConstructor();
    if (!Recognition) {
      setError("Voice input isn't supported in this browser. Use Chrome or Edge, or type your answer.");
      return;
    }

    setError("");
    finalTextRef.current = existingText.trim();

    const recognition = new Recognition();
    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;
        if (result.isFinal) {
          finalTextRef.current = (finalTextRef.current + " " + text).trim();
        } else {
          interim += text;
        }
      }
      onTextRef.current((finalTextRef.current + " " + interim).trim());
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setError("Microphone access was blocked. Allow it in your browser and try again.");
      } else if (event.error === "network") {
        setError("Voice input needs an internet connection.");
      } else if (event.error !== "no-speech" && event.error !== "aborted") {
        setError("Voice input stopped unexpectedly. You can type your answer instead.");
      }
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  return { listening, supported, error, start, stop };
}