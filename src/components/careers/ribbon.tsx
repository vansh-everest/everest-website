/**
 * The fine-line ribbons behind the "Let's Move India" band. Each ribbon is drawn as `lines`
 * curves blended between two edge paths that share the same commands, so the lines fan out
 * where the edges part and bunch up where they meet.
 */
function blend(a: number[], b: number[], t: number) {
  return a.map((v, i) => v + (b[i] - v) * t);
}

function path(p: number[]) {
  const [mx, my, ...rest] = p.map((v) => Math.round(v * 10) / 10);
  const segments: string[] = [];
  for (let i = 0; i < rest.length; i += 6) segments.push(`C${rest.slice(i, i + 6).join(" ")}`);
  return `M${mx} ${my}${segments.join("")}`;
}

export function Ribbon({
  width,
  height,
  from,
  to,
  lines = 48,
  className = "",
}: {
  width: number;
  height: number;
  /** M x y, then groups of six for each C segment. */
  from: number[];
  to: number[];
  lines?: number;
  className?: string;
}) {
  return (
    <svg aria-hidden viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" fill="none" className={`pointer-events-none absolute ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <path key={i} d={path(blend(from, to, i / (lines - 1)))} stroke="#005a99" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}
