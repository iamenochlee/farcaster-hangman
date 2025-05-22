import React from "react";

export default function HangmanDrawing({
  wrongGuesses,
  color = "#A0055D",
  gallowsColor = "#836EF9",
}: {
  wrongGuesses: number;
  color?: string;
  gallowsColor?: string;
}) {
  // There are 6 wrong guesses: head, body, left arm, right arm, left leg, right leg
  // Podium and gallows are always shown
  return (
    <svg width="120" height="140" viewBox="0 0 120 140">
      {/* Podium and gallows */}
      <line
        x1="100"
        y1="130"
        x2="30"
        y2="130"
        stroke={gallowsColor}
        strokeWidth="6"
      />
      <line
        x1="30"
        y1="130"
        x2="30"
        y2="30"
        stroke={gallowsColor}
        strokeWidth="6"
      />
      <line
        x1="30"
        y1="30"
        x2="65"
        y2="30"
        stroke={gallowsColor}
        strokeWidth="6"
      />
      <line
        x1="65"
        y1="30"
        x2="65"
        y2="50"
        stroke={gallowsColor}
        strokeWidth="6"
      />
      {/* Head */}
      {wrongGuesses > 0 && (
        <circle
          cx="65"
          cy="60"
          r="12"
          stroke={color}
          strokeWidth="4"
          fill="none"
        />
      )}
      {/* Body */}
      {wrongGuesses > 1 && (
        <line x1="65" y1="72" x2="65" y2="100" stroke={color} strokeWidth="4" />
      )}
      {/* Left Arm */}
      {wrongGuesses > 2 && (
        <line x1="65" y1="80" x2="55" y2="90" stroke={color} strokeWidth="4" />
      )}
      {/* Right Arm */}
      {wrongGuesses > 3 && (
        <line x1="65" y1="80" x2="75" y2="90" stroke={color} strokeWidth="4" />
      )}
      {/* Left Leg */}
      {wrongGuesses > 4 && (
        <line
          x1="65"
          y1="100"
          x2="60"
          y2="120"
          stroke={color}
          strokeWidth="4"
        />
      )}
      {/* Right Leg */}
      {wrongGuesses > 5 && (
        <line
          x1="65"
          y1="100"
          x2="70"
          y2="120"
          stroke={color}
          strokeWidth="4"
        />
      )}
    </svg>
  );
}
