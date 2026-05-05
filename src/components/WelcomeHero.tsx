import { useEffect, useState, useRef, useCallback } from 'react';
import type { WelcomeLine } from '../data/portfolio';

interface WelcomeHeroProps {
  lines: WelcomeLine[];
  onComplete: () => void;
}

export default function WelcomeHero({ lines, onComplete }: WelcomeHeroProps) {
  const [currentLine, setCurrentLine] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [allDone, setAllDone] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
  }, []);

  useEffect(() => {
    clearTimers();
    if (currentLine >= lines.length) {
      setIsTyping(false);
      setAllDone(true);
      return;
    }

    const line = lines[currentLine];
    const text = line.text;
    let charIndex = 0;
    setIsTyping(true);
    setDisplayText('');

    const typeChar = () => {
      if (charIndex < text.length) {
        setDisplayText(text.slice(0, charIndex + 1));
        charIndex++;
        const delay = text[charIndex - 1] === ' ' ? 40 : 60 + Math.random() * 40;
        timerRef.current.push(setTimeout(typeChar, delay));
      } else {
        setIsTyping(false);
        const pause = line.pauseAfter || 200;
        timerRef.current.push(
          setTimeout(() => {
            setCurrentLine((prev) => prev + 1);
          }, pause)
        );
      }
    };

    timerRef.current.push(setTimeout(typeChar, 400));
    return clearTimers;
  }, [currentLine, lines, clearTimers]);

  const handleEnter = useCallback(() => {
    if (!allDone) return;
    setFadingOut(true);
    setTimeout(onComplete, 600);
  }, [allDone, onComplete]);

  useEffect(() => {
    if (!allDone) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') handleEnter();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [allDone, handleEnter]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-terminal-bg transition-opacity duration-500 ${
        fadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="scanline-overlay" />

      <div className="relative z-10 w-full max-w-2xl px-6">
        <div className="space-y-2 sm:space-y-3">
          {lines.slice(0, currentLine + 1).map((line, i) => {
            const isCurrentLine = i === currentLine;
            const shownText = isCurrentLine ? displayText : line.text;

            return (
              <div
                key={i}
                className={`opacity-0 animate-fade-in ${line.className || 'text-terminal-text'}`}
                style={{
                  fontSize: i === 2 ? '2.5rem' : i === 3 ? '1.25rem' : '1.1rem',
                  lineHeight: i === 2 ? '1.2' : i === 3 ? '1.6' : '1.5',
                }}
              >
                <span>{shownText}</span>
                {isCurrentLine && isTyping && (
                  <span className="inline-block w-[2px] h-[0.9em] bg-terminal-accent/80 animate-cursor ml-0.5 align-text-bottom" />
                )}
              </div>
            );
          })}
        </div>

        {allDone && (
          <div className="opacity-0 animate-fade-in mt-10 sm:mt-14" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={handleEnter}
              className="group flex items-center gap-2 text-[10px] text-terminal-muted/60 uppercase tracking-[0.2em]
                         hover:text-terminal-accent transition-colors duration-300"
            >
              <span className="w-5 h-5 flex items-center justify-center border border-terminal-border/50 rounded-sm
                               group-hover:border-terminal-accent/40 transition-colors duration-300">
                <span className="text-[9px]">&#9654;</span>
              </span>
              <span>press enter or click to continue</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
