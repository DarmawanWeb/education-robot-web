import type { LabKit } from '@taksu/content';
import { LevelChip } from '../ui/level-chip';

/** Level colour for the three kits, a neutral chip for anything else. */
export function KitChip({ kit, label }: { kit: LabKit; label: string }) {
  if (kit === 'other') {
    return (
      <span className="bg-surface-muted inline-flex items-center rounded-sm px-2 py-0.5 text-sm font-bold">
        {label}
      </span>
    );
  }
  return <LevelChip level={kit}>{label}</LevelChip>;
}
