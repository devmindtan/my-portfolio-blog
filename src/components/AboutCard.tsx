import {
  User,
  MapPin,
  Mail,
  Phone,
  GraduationCap,
  Github,
  Linkedin,
} from "lucide-react";
import type { Profile } from "../data/portfolio";

interface AboutCardProps {
  profile: Profile;
}

export default function AboutCard({ profile }: AboutCardProps) {
  return (
    <div className="col-span-4 sm:col-span-4 card-base card-glow">
      <div className="terminal-header">
        <User size={11} />
        <span>about.md</span>
      </div>

      <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6">
        {/* Location + Email */}
        <div className="flex flex-col gap-2">
          <span className="text-[9px] text-terminal-muted/60 uppercase tracking-wider">
            contact
          </span>
          {profile.location && (
            <div className="flex items-center gap-2 text-[11px] text-terminal-text/75">
              <span className="p-1.5 rounded-sm border border-terminal-border/40 bg-terminal-highlight/20">
                <MapPin size={11} />
              </span>
              {profile.location}
            </div>
          )}
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center gap-2 text-[11px] text-terminal-text/75 hover:text-terminal-accent transition-colors group"
            >
              <span className="p-1.5 rounded-sm border border-terminal-border/40 bg-terminal-highlight/20 group-hover:border-terminal-accent/40 transition-colors">
                <Mail size={11} />
              </span>
              {profile.email}
            </a>
          )}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-2">
          <span className="text-[9px] text-terminal-muted/60 uppercase tracking-wider">
            phone
          </span>
          <a
            href={`tel:${profile.phone}`}
            className="flex items-center gap-2 text-[11px] text-terminal-text/75 hover:text-terminal-accent transition-colors group"
          >
            <span className="p-1.5 rounded-sm border border-terminal-border/40 bg-terminal-highlight/20 group-hover:border-terminal-accent/40 transition-colors">
              <Phone size={11} />
            </span>
            {profile.phone}
          </a>
        </div>

        {/* Social */}
        <div className="flex flex-col gap-2">
          <span className="text-[9px] text-terminal-muted/60 uppercase tracking-wider">
            links
          </span>
          <div className="flex flex-col gap-1.5">
            <a
              href={`https://${profile.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[11px] text-terminal-text/75 hover:text-terminal-accent transition-colors group"
            >
              <span className="p-1.5 rounded-sm border border-terminal-border/40 bg-terminal-highlight/20 group-hover:border-terminal-accent/40 transition-colors">
                <Github size={11} />
              </span>
              {profile.github}
            </a>
            <a
              href={`https://${profile.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[11px] text-terminal-text/75 hover:text-terminal-accent transition-colors group"
            >
              <span className="p-1.5 rounded-sm border border-terminal-border/40 bg-terminal-highlight/20 group-hover:border-terminal-accent/40 transition-colors">
                <Linkedin size={11} />
              </span>
              {profile.linkedin}
            </a>
          </div>
        </div>

        {/* Education */}
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-1.5 text-[9px] text-terminal-muted/60 uppercase tracking-wider">
            <GraduationCap size={10} />
            education
          </span>
          {profile.education.map((edu, i) => (
            <div key={i} className="border-l-2 border-terminal-accent/30 pl-3">
              <div className="text-[11px] text-terminal-text/85 font-medium leading-snug">
                {edu.degree}
              </div>
              <div className="text-[10px] text-terminal-muted/65 mt-0.5">
                {edu.school}
              </div>
              <div className="text-[10px] text-terminal-accent/60 font-mono mt-0.5">
                {edu.year}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
