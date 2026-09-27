import { useEffect, useRef, useState } from "react";

interface CountUpValueProps {
  /** Any figure string, e.g. "288 MW", "60.4%", "23 min", "~2x" */
  value: string;
  duration?: number;
  className?: string;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Animates the first number found inside a figure string when it scrolls
 * into view. Prefix/suffix text (units, symbols) is preserved as-is.
 *
 * Honours `prefers-reduced-motion: reduce`: the final figure is rendered
 * straight away instead of counting up.
 */
const CountUpValue = ({ value, duration = 1600, className }: CountUpValueProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [reduced] = useState(prefersReducedMotion);
  const [visible, setVisible] = useState(false);
  const [display, setDisplay] = useState<string | null>(null);

  const match = value.match(/-?\d+(?:[.,]\d+)?/);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (reduced || !visible || !match) return;
    const raw = match[0];
    const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
    const target = parseFloat(raw.replace(",", "."));
    let frame = 0;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay((target * eased).toFixed(decimals));
      if (progress < 1) frame = requestAnimationFrame(step);
      else setDisplay(target.toFixed(decimals));
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [reduced, visible, duration, match?.[0]]);

  // No number to animate, or the visitor asked for reduced motion: show the
  // finished figure immediately.
  if (!match || reduced) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    );
  }

  const raw = match[0];
  const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
  const before = value.slice(0, match.index);
  const after = value.slice((match.index ?? 0) + raw.length);
  const shown = display ?? (0).toFixed(decimals);

  return (
    <span ref={ref} className={className}>
      {before}
      <span className="tabular-nums">{shown}</span>
      {after}
    </span>
  );
};

export default CountUpValue;
