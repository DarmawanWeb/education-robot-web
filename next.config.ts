import path from 'node:path';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
const monorepoRoot = path.join(process.cwd(), '../..');

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: monorepoRoot,
  turbopack: { root: monorepoRoot },
  transpilePackages: ['@taksu/ui', '@taksu/content'],
  poweredByHeader: false,
  agentRules: false,
  reactStrictMode: true,
  images: { formats: ['image/avif', 'image/webp'] },
  async redirects() {
    // The blog moved to the company profile; old links keep working.
    const company = (process.env.NEXT_PUBLIC_COMPANY_URL ?? 'http://localhost:3000').replace(
      /\/+$/,
      '',
    );
    const locale = '/:locale(id|en)';
    return [
      { source: `${locale}/blog`, destination: `${company}/:locale/blog`, permanent: true },
      {
        source: `${locale}/blog/feed.xml`,
        destination: `${company}/:locale/blog/feed.xml`,
        permanent: true,
      },
      {
        source: `${locale}/blog/:slug`,
        destination: `${company}/:locale/blog/:slug`,
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
