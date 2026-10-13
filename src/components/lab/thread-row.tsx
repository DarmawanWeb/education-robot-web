import { Pin } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export interface ThreadRowData {
  id: string;
  title: string;
  category: string;
  byline: string;
  replies: string;
  activity: string;
  pinned: boolean;
  staff: boolean;
}

/** A forum topic in a list: title first, then who asked, where, and how lively it is. */
export function ThreadRow({
  thread,
  labels,
}: {
  thread: ThreadRowData;
  labels: { pinned: string; staff: string };
}) {
  return (
    <li className="border-border relative border-b py-5 first:pt-0">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {thread.pinned ? (
          <span className="bg-accent inline-flex items-center gap-1 rounded-sm px-2 py-0.5 font-bold text-black">
            <Pin className="size-3.5" aria-hidden />
            {labels.pinned}
          </span>
        ) : null}
        <span className="bg-surface-muted rounded-sm px-2 py-0.5 font-bold">{thread.category}</span>
      </div>
      <h3 className="mt-2 text-lg leading-snug font-bold">
        <Link
          href={`/lab/forum/${thread.id}`}
          className="decoration-primary underline-offset-4 hover:underline"
        >
          {thread.title}
        </Link>
      </h3>
      <p className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.95rem]">
        <span>
          {thread.byline}
          {thread.staff ? (
            <span className="bg-ink text-ink-foreground ml-2 rounded-sm px-1.5 py-0.5 text-xs font-bold">
              {labels.staff}
            </span>
          ) : null}
        </span>
        <span>{thread.replies}</span>
        <span>{thread.activity}</span>
      </p>
    </li>
  );
}
