import path from 'node:path';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
const monorepoRoot = path.join(process.cwd(), '../..');
const trimSlash = (url: string) => url.replace(/\/+$/, '');

/**
 * Old addresses, sent to where the same pages live now: the first education site (school levels
 * and a curriculum, where SD is Ciko, SMP Momo, SMA Garu) and the Indonesian paths the store used
 * before its routes were named in English.
 */
function movedPages() {
  const sim = trimSlash(process.env.NEXT_PUBLIC_SIMULATOR_URL || 'http://localhost:3001');
  const locale = '/:locale(id|en)';
  const robots = { sd: 'ciko', smp: 'momo', sma: 'garu' } as const;
  const guides = {
    'memulai-sd-v1': 'mulai-ciko',
    'rakit-robot-smp': 'rakit-momo',
    'panduan-guru': 'mengajar-di-kelas',
    'memakai-simulator': 'memakai-simulator',
    'keselamatan-baterai': 'keselamatan-baterai',
  } as const;
  const moved: [string, string][] = [
    // Indonesian paths, before the English route names.
    [`${locale}/belajar/panduan/:slug`, '/:locale/learn/guides/:slug'],
    [`${locale}/belajar/:robot`, '/:locale/learn/:robot'],
    [`${locale}/belajar`, '/:locale/learn'],
    [`${locale}/aksesori/:slug`, '/:locale/accessories/:slug'],
    [`${locale}/aksesori`, '/:locale/accessories'],
    [`${locale}/bisnis`, '/:locale/business'],
    [`${locale}/bantuan`, '/:locale/help'],
    [`${locale}/keranjang`, '/:locale/cart'],
    // The first education site.
    [`${locale}/kits`, '/:locale/robot'],
    ...Object.entries(robots).flatMap(([level, robot]): [string, string][] => [
      [`${locale}/kits/${level}`, `/:locale/robot/${robot}`],
      [
        `${locale}/curriculum/${level}`,
        robot === 'garu' ? '/:locale/learn' : `/:locale/learn/${robot}`,
      ],
    ]),
    [`${locale}/curriculum`, '/:locale/learn'],
    ...Object.entries(guides).map(([old, slug]): [string, string] => [
      `${locale}/guides/${old}`,
      `/:locale/learn/guides/${slug}`,
    ]),
    [`${locale}/guides/persiapan-sma-ros2`, '/:locale/robot/garu'],
    [`${locale}/guides`, '/:locale/learn'],
    [`${locale}/upgrades`, '/:locale/accessories'],
    [`${locale}/schools`, '/:locale/business'],
    [`${locale}/contact`, '/:locale/help'],
    [`${locale}/simulator`, `${sim}/:locale`],
    [`${locale}/lab/:path*`, '/:locale'],
  ];
  return moved.map(([source, destination]) => ({ source, destination, permanent: true }));
}

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: monorepoRoot,
  turbopack: { root: monorepoRoot },
  transpilePackages: ['@dctedu/ui', '@dctedu/catalog'],
  poweredByHeader: false,
  agentRules: false,
  reactStrictMode: true,
  images: { formats: ['image/avif', 'image/webp'] },
  async redirects() {
    return movedPages();
  },
};

export default withNextIntl(nextConfig);
