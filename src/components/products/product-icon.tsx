import type { ProductIcon as Icon } from '@dctedu/catalog';
import { cn } from '@dctedu/ui/lib/utils';
import {
  BatteryCharging,
  Boxes,
  Camera,
  Gamepad2,
  Grab,
  GraduationCap,
  Map as MapIcon,
  PlugZap,
  ScanEye,
  Trophy,
  Wrench,
} from 'lucide-react';

const icons = {
  remote: Gamepad2,
  sensor: ScanEye,
  gripper: Grab,
  vision: Camera,
  trophy: Trophy,
  arena: MapIcon,
  battery: BatteryCharging,
  spares: Wrench,
  charging: PlugZap,
  storage: Boxes,
  teacher: GraduationCap,
} as const;

/** The product's symbol, white on an asphalt tile. */
export function ProductIcon({ icon, className }: { icon: Icon; className?: string }) {
  const Glyph = icons[icon];
  return (
    <span
      aria-hidden
      className={cn('bg-ink text-ink-foreground grid place-items-center rounded-lg', className)}
    >
      <Glyph className="size-[44%] stroke-[1.75]" />
    </span>
  );
}
