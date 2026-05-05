import { User } from 'lucide-react';
import type { Profile } from '../data/portfolio';

interface AboutCardProps {
  profile: Profile;
}

export default function AboutCard({ profile }: AboutCardProps) {
  const paragraphs = profile.summary.split('. ').reduce<string[]>((acc, part, i) => {
    if (i < 2) acc.push(part + (i < 1 ? '.' : ''));
    return acc;
  }, []);

  if (paragraphs.length < 2 && profile.summary) {
    const mid = Math.floor(profile.summary.length * 0.55);
    const splitAt = profile.summary.lastIndexOf('. ', mid) + 1;
    if (splitAt > 0) {
      paragraphs.length = 0;
      paragraphs.push(profile.summary.slice(0, splitAt).trim());
      paragraphs.push(profile.summary.slice(splitAt).trim());
    } else {
      paragraphs.length = 0;
      paragraphs.push(profile.summary);
    }
  }

  return (
    <div className="col-span-4 sm:col-span-2 card-base card-glow">
      <div className="terminal-header">
        <User size={11} />
        <span>about.md</span>
      </div>
      <div className="p-4 sm:p-5 space-y-2.5">
        {paragraphs.map((text, i) => (
          <p key={i} className={`text-[11px] leading-relaxed ${i === 0 ? 'text-terminal-text/80' : 'text-terminal-text/60'}`}>
            {text}
          </p>
        ))}
      </div>
    </div>
  );
}
