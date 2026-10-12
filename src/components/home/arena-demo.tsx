'use client';

import { cn } from '@taksu/ui/lib/utils';
import { Pause, Play } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

/** Closed track with tangent-continuous joins, drawn in a 640 × 420 arena. */
const TRACK =
  'M160 340C300 340 420 350 500 320C580 290 600 200 540 150C480 100 420 170 340 150C260 130 250 70 180 80C90 92.9 70 220 90 280C105 325 130 340 160 340Z';
const SPEED = 92; // arena units per second
const LOOK = 14; // distance used to measure how sharply the track bends
const TURN = 0.06; // radians of bend before a sensor reaches the tape

type Sensors = { left: boolean; right: boolean };

function headingAt(path: SVGPathElement, length: number, at: number) {
  const a = path.getPointAtLength((at - 1 + length) % length);
  const b = path.getPointAtLength((at + 1) % length);
  return Math.atan2(b.y - a.y, b.x - a.x);
}

function wrapAngle(angle: number) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

/**
 * The page's one moment of motion: a top-down robot following tape, with its two line
 * sensors lighting up as the track bends. Starts paused for people who prefer less motion.
 */
export function ArenaDemo() {
  const t = useTranslations('Arena');
  const pathRef = useRef<SVGPathElement>(null);
  const robotRef = useRef<SVGGElement>(null);
  const leftRef = useRef<SVGCircleElement>(null);
  const rightRef = useRef<SVGCircleElement>(null);
  const distance = useRef(0);
  const [running, setRunning] = useState(false);
  const [sensors, setSensors] = useState<Sensors>({ left: false, right: false });

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) setRunning(true);
    else distance.current = 330; // parked on a right-hand bend so one sensor is lit
  }, []);

  useEffect(() => {
    const path = pathRef.current;
    const robot = robotRef.current;
    if (!path || !robot) return;
    const length = path.getTotalLength();
    let last = performance.now();
    let frame = 0;
    let shown: Sensors = { left: false, right: false };

    const draw = () => {
      const at = distance.current % length;
      const point = path.getPointAtLength(at);
      const heading = headingAt(path, length, at);
      const bend = wrapAngle(
        headingAt(path, length, (at + LOOK) % length) -
          headingAt(path, length, (at - LOOK + length) % length),
      );
      robot.setAttribute(
        'transform',
        `translate(${point.x.toFixed(1)} ${point.y.toFixed(1)}) rotate(${((heading * 180) / Math.PI).toFixed(1)})`,
      );
      const next = { left: bend < -TURN, right: bend > TURN };
      leftRef.current?.setAttribute('data-on', String(next.left));
      rightRef.current?.setAttribute('data-on', String(next.right));
      if (next.left !== shown.left || next.right !== shown.right) {
        shown = next;
        setSensors(next);
      }
    };

    const tick = (now: number) => {
      distance.current += (Math.min(0.05, (now - last) / 1000) || 0) * SPEED;
      last = now;
      draw();
      frame = requestAnimationFrame(tick);
    };

    draw();
    if (running) frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running]);

  return (
    <figure className="flex flex-col gap-3">
      <div className="border-edge bg-surface box-ink relative overflow-hidden rounded-lg">
        <div aria-hidden className="ruler text-foreground/70 h-4 border-b border-current/20" />
        <svg viewBox="0 0 640 420" role="img" className="block h-auto w-full">
          <title>{t('label')}</title>
          <rect x="146" y="314" width="10" height="52" fill="var(--accent)" stroke="#000" />
          <path
            ref={pathRef}
            d={TRACK}
            fill="none"
            stroke="var(--track)"
            strokeWidth="22"
            strokeLinejoin="round"
            className="dark:stroke-white"
          />
          <g ref={robotRef} transform="translate(160 340)">
            <g transform="scale(1.3)">
              <rect x="-14" y="-24" width="26" height="7" rx="2" fill="#000" />
              <rect x="-14" y="17" width="26" height="7" rx="2" fill="#000" />
              <rect
                x="-24"
                y="-18"
                width="44"
                height="36"
                rx="7"
                fill="var(--primary)"
                stroke="#000"
                strokeWidth="2.5"
              />
              <rect x="2" y="-10" width="12" height="20" rx="2" fill="#0d1b2a" />
              <circle cx="8" cy="-4.5" r="2" fill="#7ff3ff" />
              <circle cx="8" cy="4.5" r="2" fill="#7ff3ff" />
              <rect x="19" y="-17" width="7" height="34" rx="2" fill="#000" />
              <circle
                ref={leftRef}
                cx="22.5"
                cy="-12"
                r="3.6"
                data-on="false"
                className="fill-neutral-500 data-[on=true]:fill-red-500"
              />
              <circle
                ref={rightRef}
                cx="22.5"
                cy="12"
                r="3.6"
                data-on="false"
                className="fill-neutral-500 data-[on=true]:fill-red-500"
              />
            </g>
          </g>
        </svg>
        <div className="border-border flex flex-wrap items-center gap-x-5 gap-y-2 border-t px-4 py-3 text-sm">
          {(['left', 'right'] as const).map((side) => (
            <span key={side} aria-hidden className="inline-flex items-center gap-2">
              <span
                className={cn(
                  'size-3 rounded-full border border-black',
                  sensors[side] ? 'bg-red-500' : 'bg-neutral-300',
                )}
              />
              <span className="font-semibold">{t(side)}</span>
              <span className="text-muted-foreground">
                {sensors[side] ? t('onLine') : t('offLine')}
              </span>
            </span>
          ))}
          <button
            type="button"
            onClick={() => setRunning((value) => !value)}
            className="border-edge hover:bg-surface-muted ml-auto inline-flex h-9 items-center gap-2 rounded-md border-2 px-3 font-bold"
          >
            {running ? (
              <Pause className="size-4" aria-hidden />
            ) : (
              <Play className="size-4" aria-hidden />
            )}
            {running ? t('pause') : t('play')}
          </button>
        </div>
      </div>
      <figcaption className="text-muted-foreground max-w-[60ch] text-[0.95rem]">
        {t('caption')}
      </figcaption>
    </figure>
  );
}
