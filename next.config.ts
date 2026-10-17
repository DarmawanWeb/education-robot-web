import path from 'node:path';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
const monorepoRoot = path.join(process.cwd(), '../..');
const trimSlash = (url: string) => url.replace(/\/+$/, '');

/**
 * The first education site (v1.0.0) ran on this host with school levels and a curriculum. Its
 * addresses go to where the same things live now: SD is Ciko, SMP Momo, SMA Garu.
 */
function firstSiteRedirects() {
  const sim = trimSlash(process.env.NEXT_PUBLIC_SIM_URL || 'http://localhost:3102');
  const locale = '/:locale(id|en)';
  const robots = { sd: 'ciko', smp: 'momo', sma: 'garu' } as const;
  const guides = {
    'memulai-sd-v1': 'mulai-ciko',
    'rakit-robot-smp': 'rakit-momo',
    'panduan-guru': 'mengajar-di-kelas',
    'persiapan-sma-ros2': 'persiapan-garu',
    'memakai-simulator': 'memakai-simulator',
    'keselamatan-baterai': 'keselamatan-baterai',
  } as const;
  const moved: [string, string][] = [
    [`${locale}/kits`, '/:locale/robot'],
    ...Object.entries(robots).flatMap(([level, robot]): [string, string][] => [
      [`${locale}/kits/${level}`, `/:locale/robot/${robot}`],
      [`${locale}/curriculum/${level}`, `/:locale/belajar/${robot}`],
    ]),
    [`${locale}/curriculum`, '/:locale/belajar'],
    [`${locale}/guides`, '/:locale/belajar'],
    ...Object.entries(guides).map(([old, slug]): [string, string] => [
      `${locale}/guides/${old}`,
      `/:locale/belajar/panduan/${slug}`,
    ]),
    [`${locale}/upgrades`, '/:locale/aksesori'],
    [`${locale}/schools`, '/:locale/bisnis'],
    [`${locale}/contact`, '/:locale/bantuan'],
    [`${locale}/simulator`, `${sim}/:locale`],
    [`${locale}/lab/:path*`, '/:locale'],
  ];
  return moved.map(([source, destination]) => ({ source, destination, permanent: true }));
}

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: monorepoRoot,
  turbopack: { root: monorepoRoot },
  transpilePackages: ['@taksu/edu-ui', '@taksu/catalog'],
  poweredByHeader: false,
  agentRules: false,
  reactStrictMode: true,
  images: { formats: ['image/avif', 'image/webp'] },
  async redirects() {
    return firstSiteRedirects();
  },
};

export default withNextIntl(nextConfig);
