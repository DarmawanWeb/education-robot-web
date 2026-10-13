import { names, simMissions } from '@taksu/content';
import { EduWordmark } from '@taksu/ui/brand/edu-wordmark';
import { cn } from '@taksu/ui/lib/utils';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Container } from '../ui/container';
import { SectionTitle } from '../ui/section-title';

/** Each row points at the page that backs our answer up. */
const rows = [
  { id: 'curriculum', href: '/curriculum' },
  { id: 'teachers', href: '/guides/panduan-guru' },
  { id: 'bench', href: '/kits' },
  { id: 'try', href: '/simulator' },
  { id: 'levels', href: '/upgrades' },
  { id: 'support', href: '/schools' },
] as const;

const proofClass =
  'mt-3 inline-block font-bold text-white underline decoration-accent decoration-[3px] underline-offset-[5px] transition-[text-decoration-thickness] hover:decoration-[5px]';

/** Our name on a strip of marking tape, stuck on slightly askew. */
function TapeLabel() {
  return (
    <span className="bg-accent inline-flex -rotate-[1.5deg] px-3 py-2 text-black shadow-[2px_2px_0_0_rgb(0_0_0/0.35)]">
      <EduWordmark name={names.edu} />
    </span>
  );
}

/**
 * Why schools pick these kits: what schools often receive next to what comes with ours. Our
 * column is a strip of the green cutting mat, the same surface the simulator and curriculum use.
 */
export async function WhySchools() {
  const t = await getTranslations('Home.why');
  const us = (id: (typeof rows)[number]['id']) => t(`rows.${id}.us`, { count: simMissions.length });

  return (
    <section className="py-16 lg:py-24" aria-labelledby="why-schools">
      <Container>
        <SectionTitle id="why-schools" title={t('title')} intro={t('intro')} />

        {/* Wide screens: a table laid over one continuous strip of mat (47% = 100 - 20 - 33). */}
        <div className="relative mt-12 hidden md:block">
          <div aria-hidden className="bg-mat absolute inset-y-0 right-0 left-[53%] rounded-lg" />
          <table className="relative w-full table-fixed border-separate border-spacing-0 text-left">
            <caption className="sr-only">{t('caption')}</caption>
            <colgroup>
              <col className="w-[20%]" />
              <col className="w-[33%]" />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th scope="col" className="pb-5 align-bottom">
                  <span className="sr-only">{t('topic')}</span>
                </th>
                <th
                  scope="col"
                  className="text-muted-foreground pr-10 pb-5 align-bottom text-base font-bold"
                >
                  {t('often')}
                </th>
                <th scope="col" className="px-8 pt-8 pb-6 align-bottom">
                  <TapeLabel />
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id}>
                  <th
                    scope="row"
                    className="border-edge border-t-2 py-6 pr-6 align-top text-lg leading-snug font-bold"
                  >
                    {t(`rows.${row.id}.topic`)}
                  </th>
                  <td className="border-edge text-muted-foreground border-t-2 py-6 pr-10 align-top leading-relaxed">
                    {t(`rows.${row.id}.often`)}
                  </td>
                  <td
                    className={cn(
                      'border-t-2 border-white/25 px-8 py-6 align-top leading-relaxed text-white',
                      index === rows.length - 1 && 'pb-9',
                    )}
                  >
                    <p>{us(row.id)}</p>
                    <Link href={row.href} className={proofClass}>
                      {t(`rows.${row.id}.link`)}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Phones: one strip of mat with our answers, what schools often get under each. */}
        <div className="bg-mat mt-10 rounded-lg md:hidden">
          <div className="px-5 pt-6 pb-2">
            <TapeLabel />
          </div>
          <ul>
            {rows.map((row) => (
              <li
                key={row.id}
                className="border-t-2 border-white/25 px-5 py-5 first:border-t-0 first:pt-3"
              >
                <h3 className="text-accent text-sm font-bold">{t(`rows.${row.id}.topic`)}</h3>
                <p className="mt-1.5 leading-relaxed">{us(row.id)}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  {t('often')}: {t(`rows.${row.id}.often`)}
                </p>
                <Link href={row.href} className={proofClass}>
                  {t(`rows.${row.id}.link`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
