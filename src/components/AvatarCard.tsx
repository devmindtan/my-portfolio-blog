import type { Profile } from "../data/portfolio";

interface AvatarCardProps {
  profile: Profile;
}

export default function AvatarCard({ profile }: AvatarCardProps) {
  return (
    <div className="col-span-4 card-base card-glow overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 sm:p-5">
        {/* Avatar */}
        <div className="relative group flex-shrink-0">
          {/* Tăng size từ w-16/20 lên w-24/28 (khoảng 96px - 112px) */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-terminal-border group-hover:border-terminal-accent/40 transition-colors duration-300 shadow-lg">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 antialiased"
              loading="lazy"
            />
          </div>

          {/* Điều chỉnh lại vị trí của chấm Status để khớp với size mới */}
          <div className="absolute bottom-1 right-1 w-4 h-4 bg-terminal-accent rounded-full border-2 border-terminal-card animate-glow shadow-[0_0_8px_rgba(var(--terminal-accent-rgb),0.6)]" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 text-center sm:text-left space-y-1.5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3">
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-terminal-text">
                {profile.name}
              </h2>
              <p className="text-[10px] text-terminal-accent uppercase tracking-wider">
                {profile.title}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-terminal-accent/5 border border-terminal-accent/20 rounded-sm self-center sm:self-auto">
              <span className="w-1.5 h-1.5 bg-terminal-accent rounded-full animate-glow" />
              <span className="text-[9px] text-terminal-accent uppercase tracking-wider">
                open to work
              </span>
            </span>
          </div>

          <p className="text-[11px] text-terminal-text/70 leading-relaxed">
            {profile.summary}
          </p>
        </div>
      </div>
    </div>
  );
}
