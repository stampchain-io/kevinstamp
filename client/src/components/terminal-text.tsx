import { useEffect, useState } from "react";

interface TerminalTextProps {
  lines: string[];
  typeSpeed?: number;
  showCursor?: boolean;
  className?: string;
}

export default function TerminalText({ 
  lines, 
  typeSpeed = 50, 
  showCursor = true,
  className = ""
}: TerminalTextProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    if (currentLineIndex >= lines.length) return;

    const currentLine = lines[currentLineIndex];
    
    if (currentCharIndex < currentLine.length) {
      const timer = setTimeout(() => {
        setDisplayedLines(prev => {
          const newLines = [...prev];
          newLines[currentLineIndex] = currentLine.slice(0, currentCharIndex + 1);
          return newLines;
        });
        setCurrentCharIndex(prev => prev + 1);
      }, typeSpeed);

      return () => clearTimeout(timer);
    } else {
      // Move to next line after a pause
      const timer = setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
        setDisplayedLines(prev => [...prev, ""]);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentLineIndex, currentCharIndex, lines, typeSpeed]);

  return (
    <div className={`terminal-window ${className}`}>
      <div className="mb-2 text-kevin-mint font-pixel text-sm">
        KEVIN@BITCOIN:~$
      </div>
      {displayedLines.map((line, index) => (
        <div key={index} className="mb-1">
          {line}
          {index === currentLineIndex && showCursor && (
            <span className="animate-terminal-cursor">_</span>
          )}
        </div>
      ))}
    </div>
  );
}
