import { Award, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import type { Certificate } from "../data/portfolio.types";

let pdfWorkerConfigured = false;

interface CertificatesCardProps {
  certificates: Certificate[];
}

export default function CertificatesCard({
  certificates,
}: CertificatesCardProps) {
  const { t } = useLanguage();
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const rafRef = useRef<number>();
  const pausedRef = useRef(false);
  const dragRef = useRef({
    dragging: false,
    startX: 0,
    startPos: 0,
    momentum: 0,
    lastX: 0,
    lastT: 0,
  });

  const CARD_W =
    typeof window !== "undefined" && window.innerWidth < 640
      ? 128 + 12
      : 160 + 12;
  const TOTAL = certificates.length * CARD_W;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function loop() {
      const d = dragRef.current;
      if (!d.dragging) {
        if (!pausedRef.current) {
          posRef.current += 0.6 + d.momentum;
          d.momentum = Math.abs(d.momentum) > 0.01 ? d.momentum * 0.92 : 0;
        }
        if (posRef.current >= TOTAL) posRef.current -= TOTAL;
        if (posRef.current < 0) posRef.current += TOTAL;
      }
      trackRef.current!.style.transform = `translateX(${-posRef.current}px)`;
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current!);
  }, [TOTAL]);

  const onMouseDown = (e: React.MouseEvent) => {
    const d = dragRef.current;
    d.dragging = true;
    d.startX = e.clientX;
    d.startPos = posRef.current;
    d.momentum = 0;
    d.lastX = e.clientX;
    d.lastT = performance.now();
  };
  const onMouseMove = (e: React.MouseEvent) => {
    const d = dragRef.current;
    if (!d.dragging) return;
    const now = performance.now();
    d.momentum = ((d.lastX - e.clientX) / (now - d.lastT || 1)) * 16;
    d.lastX = e.clientX;
    d.lastT = now;
    posRef.current = d.startPos + (d.startX - e.clientX);
  };
  const onMouseUp = () => {
    dragRef.current.dragging = false;
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const d = dragRef.current;
    d.dragging = true;
    d.startX = e.touches[0].clientX;
    d.startPos = posRef.current;
    d.momentum = 0;
    d.lastX = e.touches[0].clientX;
    d.lastT = performance.now();
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const d = dragRef.current;
    if (!d.dragging) return;
    const now = performance.now();
    d.momentum = ((d.lastX - e.touches[0].clientX) / (now - d.lastT || 1)) * 16;
    d.lastX = e.touches[0].clientX;
    d.lastT = now;
    posRef.current = d.startPos + (d.startX - e.touches[0].clientX);
  };
  const onTouchEnd = () => {
    dragRef.current.dragging = false;
  };

  //   const tripled = [...certificates, ...certificates, ...certificates];

  // Tạo helper render 1 set + divider
  function renderSet(certs: Certificate[], setIndex: number) {
    return (
      <div key={setIndex} className="flex items-center gap-3">
        {certs.map((cert, i) => (
          <CertCard key={i} cert={cert} />
        ))}
        {/* Divider ngăn cách giữa các vòng lặp */}
        <div className="flex-shrink-0 flex flex-col items-center gap-1 px-2 opacity-60">
          {/* Đường kẻ trên */}
          <div className="w-px h-8 bg-terminal-border/60" />

          {/* Chữ Loop màu trắng */}
          <span className="text-[9px] font-mono text-white/90 tracking-widest uppercase whitespace-nowrap">
            ∿ loop
          </span>

          {/* Đường kẻ dưới */}
          <div className="w-px h-8 bg-terminal-border/60" />
        </div>
      </div>
    );
  }
  return (
    <div className="col-span-4 min-w-0 card-base card-glow overflow-x-clip">
      <div className="terminal-header">
        <Award size={11} />
        <span>certs.json</span>
        <span className="ml-auto text-[9px] text-green-400/60">
          ● {t("cert.scrollHint")}
        </span>
      </div>

      <div
        ref={outerRef}
        className="relative overflow-x-hidden py-3 pb-4 cursor-grab active:cursor-grabbing select-none"
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => {
          pausedRef.current = false;
          dragRef.current.dragging = false;
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 sm:w-8 z-10 bg-gradient-to-r from-terminal-bg to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 sm:w-8 z-10 bg-gradient-to-l from-terminal-bg to-transparent" />

        <div
          ref={trackRef}
          className="flex items-center gap-3 w-max will-change-transform"
        >
          {[0, 1, 2].map((i) => renderSet(certificates, i))}
        </div>
      </div>
    </div>
  );
}

function CertCard({ cert }: { cert: Certificate }) {
  const { t } = useLanguage();
  const isPdf = cert.imageUrl?.toLowerCase().endsWith(".pdf");
  const cardClassName =
    "flex-shrink-0 w-32 sm:w-40 rounded border border-terminal-border/40 bg-terminal-highlight/20 hover:border-terminal-accent/60 transition-all duration-200 overflow-hidden group cursor-pointer";

  const cardContent = (
    <>
      <div className="relative w-full h-20 sm:h-24 bg-terminal-highlight/30 overflow-hidden">
        {isPdf ? (
          <PdfThumb url={cert.imageUrl!} />
        ) : cert.imageUrl ? (
          <img
            src={cert.imageUrl}
            alt={cert.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Award size={28} className="text-terminal-accent/30" />
          </div>
        )}

        <div className="absolute top-1.5 right-1.5 p-0.5 rounded bg-terminal-bg/80 text-terminal-muted/50 group-hover:text-terminal-accent transition-colors">
          {cert.url && <ExternalLink size={8} />}
        </div>
        <div className="absolute bottom-1.5 left-1.5">
          <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-terminal-bg/80 border border-green-500/30 text-green-400/70">
            {t("cert.verified")}
          </span>
        </div>
      </div>

      <div className="p-2">
        <p className="text-[10px] text-terminal-text/80 font-medium leading-snug truncate group-hover:text-terminal-text transition-colors">
          {cert.name}
        </p>
        <p className="text-[9px] text-terminal-muted/60 truncate mt-0.5">
          {cert.issuer}
        </p>
        <p className="text-[9px] text-terminal-accent/50 mt-1">{cert.date}</p>
      </div>
    </>
  );

  if (cert.url) {
    return (
      <a
        href={cert.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClassName}
        onDragStart={(e) => e.preventDefault()}
      >
        {cardContent}
      </a>
    );
  }

  return <div className={cardClassName}>{cardContent}</div>;
}
// Component render trang 1 của PDF ra canvas
function PdfThumb({ url }: { url: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const [{ getDocument, GlobalWorkerOptions }, workerModule] =
          await Promise.all([
            import("pdfjs-dist"),
            import("pdfjs-dist/build/pdf.worker.min.mjs?url"),
          ]);

        if (!pdfWorkerConfigured) {
          GlobalWorkerOptions.workerSrc = workerModule.default;
          pdfWorkerConfigured = true;
        }

        const pdf = await getDocument({
          url,
          disableRange: true,
          disableStream: true,
        }).promise;
        const page = await pdf.getPage(1);

        if (cancelled || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d")!;

        // Fit vào khung 160x96
        const viewport = page.getViewport({ scale: 1 });
        const scale = Math.max(160 / viewport.width, 96 / viewport.height);
        const scaled = page.getViewport({ scale });

        canvas.width = scaled.width;
        canvas.height = scaled.height;

        await page.render({ canvas, canvasContext: ctx, viewport: scaled })
          .promise;
      } catch {
        if (!cancelled) setError(true);
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [url]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Award size={28} className="text-terminal-accent/30" />
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      style={{ objectFit: "cover" }}
    />
  );
}
