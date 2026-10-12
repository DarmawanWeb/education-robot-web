import path from 'node:path';
import createMDX from '@next/mdx';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
/** Blog posts are MDX files under src/content/blog. */
const withMDX = createMDX({ extension: /\.mdx$/ });
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
};

export default withNextIntl(withMDX(nextConfig));
