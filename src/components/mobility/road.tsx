const ROAD = "#006db8";

/** The road and its dashes along one path. */
function Lane({ d }: { d: string }) {
  return (
    <>
      <path d={d} fill="none" stroke={ROAD} strokeWidth={8} />
      <path d={d} fill="none" stroke="#fff" strokeWidth={2} strokeDasharray="16 12" />
    </>
  );
}

/** The small cab, seen from above and heading right. */
function Cab({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="104" height="46" rx="18" fill="#062f50" />
      <rect x="18.5" y="8" width="19" height="29" rx="4" fill="#62829c" />
      <rect x="64.5" y="8" width="23" height="29" rx="7" fill="#adc6da" />
      <rect x="91" y="6" width="9" height="9" rx="2.5" fill="#f1d614" />
      <rect x="91" y="31" width="9" height="9" rx="2.5" fill="#f1d614" />
    </g>
  );
}

/** The divider: a road that bends once and runs on behind the cab, past both edges of the screen. */
export function Road() {
  return (
    <div aria-hidden className="relative mt-14 h-[100px] overflow-hidden bg-white lg:mt-[103px]">
      <svg width="375" height="100" viewBox="0 0 375 100" className="absolute left-1/2 top-0 -translate-x-1/2 overflow-visible lg:hidden">
        <Lane d="M-1200 23H58C112 23 128 77 190 77H1600" />
        <Cab x={200} y={54} />
      </svg>
      <svg width="1440" height="100" viewBox="0 0 1440 100" className="absolute left-1/2 top-0 hidden -translate-x-1/2 overflow-visible lg:block">
        <Lane d="M-2400 23.5H565C628 23.5 642 77.5 705 77.5H3900" />
        <Cab x={732} y={54.5} />
      </svg>
    </div>
  );
}
