import type { RobotSlug } from '@taksu/catalog';

/** Each robot's own colour, as Tailwind classes: Ciko red, Momo yellow, Garu steel blue. */
export const robotStyle: Record<RobotSlug, { fill: string; text: string; border: string }> = {
  ciko: { fill: 'bg-robot-ciko', text: 'text-white', border: 'border-robot-ciko' },
  momo: { fill: 'bg-robot-momo', text: 'text-[#191b20]', border: 'border-robot-momo' },
  garu: { fill: 'bg-robot-garu', text: 'text-white', border: 'border-robot-garu' },
};
