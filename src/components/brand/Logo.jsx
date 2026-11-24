import { useId } from "react";

/** Sahil's mark: an "S" drawn as a route between two nodes (memory link / model routing). */
export function LogoMark({ size = 36, className = "" }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`lg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4F46E5" />
          <stop offset="1" stopColor="#0EA5E9" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill={`url(#lg-${id})`} />
      <path
        d="M41 21.5c-2-3.2-5.4-5-9.4-5-5.6 0-9.6 3.4-9.6 8 0 4.4 3.6 6.4 9.6 7.6 6.2 1.2 10 3.4 10 8.2 0 4.8-4.4 8.2-10.2 8.2-4.2 0-7.8-1.8-9.8-5.2"
        fill="none"
        stroke="#fff"
        strokeWidth="4.6"
        strokeLinecap="round"
      />
      <circle cx="46.2" cy="16" r="3.3" fill="#fff" />
      <circle cx="17.4" cy="48.6" r="3.3" fill="#fff" />
    </svg>
  );
}

/** Mark + wordmark, used in the navbar and footer. */
export default function Logo({ size = 36 }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={size} />
      <span className="font-display text-[1.05rem] font-extrabold leading-none tracking-tight text-ink">
        sahil<span className="text-sky">.</span>dangol
      </span>
    </span>
  );
}
