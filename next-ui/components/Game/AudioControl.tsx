"use client";
import { useState, useEffect, useRef } from "react";

// Module-level variable to track mute state for sound effects
let globalIsMuted = false;

export function AudioControl() {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const incorrectSoundRef = useRef<HTMLAudioElement | null>(null);
  const victorySoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio elements
    audioRef.current = new Audio("/audio/hangman-theme.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.1;

    correctSoundRef.current = new Audio("/audio/correct.mp3");
    correctSoundRef.current.volume = 0.2;

    incorrectSoundRef.current = new Audio("/audio/incorrect.mp3");
    incorrectSoundRef.current.volume = 0.2;

    victorySoundRef.current = new Audio("/audio/victory.mp3");
    victorySoundRef.current.volume = 0.2;

    // Start playing background music when component mounts
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.log("Autoplay prevented:", error);
      });
    }

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (correctSoundRef.current) {
        correctSoundRef.current.pause();
        correctSoundRef.current = null;
      }
      if (incorrectSoundRef.current) {
        incorrectSoundRef.current.pause();
        incorrectSoundRef.current = null;
      }
      if (victorySoundRef.current) {
        victorySoundRef.current.pause();
        victorySoundRef.current = null;
      }
    };
  }, []);

  // Sync audio volume with isMuted
  useEffect(() => {
    globalIsMuted = isMuted;
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : 0.1;
      if (!isMuted) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [isMuted]);

  const toggleMute = () => setIsMuted((m) => !m);

  return (
    <button
      onClick={toggleMute}
      className="p-3 bg-[#200052]/80 text-white rounded-full hover:bg-[#836EF9]/80 transition-colors z-50"
      aria-label={isMuted ? "Unmute" : "Mute"}
    >
      {isMuted ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            clipRule="evenodd"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
        </svg>
      )}
    </button>
  );
}

// Export the sound functions for use in other components
export const isAudioMuted = () => globalIsMuted;

export const playCorrectGuess = () => {
  if (globalIsMuted) return;
  const audio = new Audio("/audio/correct.mp3");
  audio.volume = 0.2;
  audio.play().catch(console.error);
};

export const playIncorrectGuess = () => {
  if (globalIsMuted) return;
  const audio = new Audio("/audio/incorrect.mp3");
  audio.volume = 0.2;
  audio.play().catch(console.error);
};

export const playVictorySound = () => {
  if (globalIsMuted) return;
  const audio = new Audio("/audio/victory.mp3");
  audio.volume = 0.2;
  audio.play().catch(console.error);
};
