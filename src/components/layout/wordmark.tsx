import { names } from '@taksu/content';
import { EduWordmark } from '@taksu/ui/brand/edu-wordmark';

export function Wordmark({ className }: { className?: string }) {
  return <EduWordmark name={names.edu} className={className} />;
}
