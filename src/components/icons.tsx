type IconProps = { className?: string; size?: number };

const base = (className = "", size = 18) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className,
  "aria-hidden": true,
});

export function ArrowUpRight({ className, size }: IconProps) {
  return <svg {...base(className, size)}><path d="M7 17 17 7M7 7h10v10" /></svg>;
}

export function ArrowRight({ className, size }: IconProps) {
  return <svg {...base(className, size)}><path d="M4 12h16m-6-6 6 6-6 6" /></svg>;
}

export function ArrowDown({ className, size }: IconProps) {
  return <svg {...base(className, size)}><path d="M12 4v16m6-6-6 6-6-6" /></svg>;
}

export function MenuIcon({ className, size }: IconProps) {
  return <svg {...base(className, size)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
}

export function CloseIcon({ className, size }: IconProps) {
  return <svg {...base(className, size)}><path d="m6 6 12 12M18 6 6 18" /></svg>;
}

export function PlusIcon({ className, size }: IconProps) {
  return <svg {...base(className, size)}><path d="M12 5v14M5 12h14" /></svg>;
}

export function CheckIcon({ className, size }: IconProps) {
  return <svg {...base(className, size)}><path d="m5 12 4 4L19 6" /></svg>;
}

export function CircleDot({ className, size }: IconProps) {
  return <svg {...base(className, size)}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" /></svg>;
}

export function SignalIcon({ className, size }: IconProps) {
  return <svg {...base(className, size)}><path d="M5 19v-2M9 19v-5M13 19v-8M17 19V8M21 19V5" /></svg>;
}

export function TargetIcon({ className, size }: IconProps) {
  return <svg {...base(className, size)}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><path d="M12 2v2M22 12h-2M12 22v-2M2 12h2" /></svg>;
}

export function ScanIcon({ className, size }: IconProps) {
  return <svg {...base(className, size)}><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" /><path d="M8 12h8M12 8v8" /></svg>;
}
