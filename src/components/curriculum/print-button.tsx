'use client';

import { Printer } from 'lucide-react';
import { actionClass } from '../ui/action-link';

/** Prints the syllabus. The page's print styles turn it into black on white paper. */
export function PrintButton({ label, className }: { label: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={actionClass('plain', className)}
    >
      <Printer aria-hidden />
      {label}
    </button>
  );
}
