import { type Robot, type SellerId, sellers } from '@dctedu/catalog';
import { Button } from '@dctedu/ui/components/button';
import { cn } from '@dctedu/ui/lib/utils';
import { MessageCircle } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { sellerHref } from '@/lib/contact';

/** The tag shown instead of availability on a robot an exclusive seller sells. */
export async function SellerBadge({ seller, className }: { seller: SellerId; className?: string }) {
  const t = await getTranslations('Seller');
  return (
    <span
      className={cn(
        'bg-ink text-ink-foreground inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.8125rem] font-bold whitespace-nowrap',
        className,
      )}
    >
      {t('badge')} · {sellers[seller].shortName}
    </span>
  );
}

/** The button that takes a buyer to the seller, with the robot already named in the message. */
export async function SellerContact({
  robot,
  seller,
  size = 'lg',
  variant = 'default',
}: {
  robot: Robot;
  seller: SellerId;
  size?: 'default' | 'lg';
  variant?: 'default' | 'ink';
}) {
  const t = await getTranslations('Seller');
  const { name, shortName } = sellers[seller];
  return (
    <Button asChild size={size} variant={variant}>
      <a
        href={sellerHref(
          seller,
          t('message', { seller: name, robot: robot.name }),
          t('subject', { robot: robot.name }),
        )}
        target="_blank"
        rel="noopener"
      >
        <MessageCircle aria-hidden />
        {t('contact', { seller: shortName })}
      </a>
    </Button>
  );
}

/** On a robot's page, in place of the price and the cart: who sells it, and how to reach them. */
export async function SellerBox({ robot, seller }: { robot: Robot; seller: SellerId }) {
  const t = await getTranslations('Seller');
  const { name } = sellers[seller];
  return (
    <div className="flex flex-col items-start gap-5">
      <div>
        <p className="text-xl font-bold">{t('soldBy', { seller: name })}</p>
        <p className="text-muted-foreground mt-2 leading-relaxed">
          {t('body', { seller: name, robot: robot.name })}
        </p>
      </div>
      <SellerContact robot={robot} seller={seller} />
    </div>
  );
}
