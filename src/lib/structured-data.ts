import {
  type Availability,
  brand,
  type Locale,
  type Product,
  pick,
  type Robot,
} from '@dctedu/catalog';
import { siteConfig } from './site-config';

/**
 * schema.org data for search engines. The company, PT Dharma Cipta Teknologi, is the Organization;
 * DCT Edu is its Brand, so a search for either name finds this site.
 */
const url = siteConfig.url.replace(/\/+$/, '');
const abs = (path: string) => `${url}${path}`;
export const organizationId = abs('/#organization');
const logo = abs('/brand/logo-512.png');

const schemaAvailability: Record<Availability, string> = {
  available: 'https://schema.org/InStock',
  preorder: 'https://schema.org/PreOrder',
  soon: 'https://schema.org/PreOrder',
};

export function organization(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': organizationId,
    name: brand.company,
    legalName: brand.company,
    alternateName: [brand.name, ...brand.alternateNames],
    url,
    logo,
    image: logo,
    description: pick(brand.story, locale),
    email: siteConfig.email,
    address: {
      '@type': 'PostalAddress',
      addressRegion: brand.region,
      addressCountry: brand.country,
    },
    brand: { '@type': 'Brand', name: brand.name, logo },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: siteConfig.email,
      ...(siteConfig.whatsappNumber ? { telephone: `+${siteConfig.whatsappNumber}` } : {}),
      availableLanguage: ['Indonesian', 'English'],
    },
  };
}

export function website(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': abs('/#website'),
    url: abs(`/${locale}`),
    name: brand.name,
    alternateName: brand.company,
    description: pick(brand.promise, locale),
    inLanguage: locale === 'id' ? 'id-ID' : 'en-US',
    publisher: { '@id': organizationId },
  };
}

/** A trail of [name, path] pairs, from the home page down to the current page. */
export function breadcrumbs(locale: Locale, trail: [string, string][]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map(([name, path], index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      item: abs(`/${locale}${path}`),
    })),
  };
}

export function robotProduct(robot: Robot, locale: Locale) {
  const page = abs(`/${locale}/robot/${robot.slug}`);
  // An exclusive seller sets the price, so those robots carry no offer here.
  const offer =
    !robot.seller && robot.price !== null
      ? {
          offers: {
            '@type': 'Offer',
            price: robot.price,
            priceCurrency: 'IDR',
            availability: schemaAvailability[robot.availability],
            url: page,
            seller: { '@id': organizationId },
          },
        }
      : {};
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${brand.name} ${robot.name}`,
    description: pick(robot.summary, locale),
    image: abs(`/og/${robot.slug}-${locale}.jpg`),
    sku: `dct-edu-${robot.slug}`,
    category: locale === 'id' ? 'Robot edukasi' : 'Educational robot',
    brand: { '@type': 'Brand', name: brand.name },
    manufacturer: { '@id': organizationId },
    audience: { '@type': 'PeopleAudience', suggestedMinAge: robot.age },
    url: page,
    ...offer,
  };
}

export function accessoryProduct(product: Product, locale: Locale) {
  const page = abs(`/${locale}/accessories/${product.slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: pick(product.name, locale),
    description: pick(product.body, locale),
    sku: `dct-edu-${product.slug}`,
    brand: { '@type': 'Brand', name: brand.name },
    manufacturer: { '@id': organizationId },
    url: page,
    ...(product.price !== null
      ? {
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'IDR',
            availability: schemaAvailability[product.availability],
            url: page,
            seller: { '@id': organizationId },
          },
        }
      : {}),
  };
}

export function faqPage(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
