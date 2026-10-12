import { describe, expect, it } from 'vitest';
import { companyUrl, mailtoUrl, simulatorUrl, whatsappUrl } from './links';

describe('links', () => {
  it('deep-links into simulator missions', () => {
    expect(simulatorUrl('id', 'smp', 'smp-radar')).toBe(
      'http://localhost:3002/id?robot=smp&mission=smp-radar',
    );
    expect(simulatorUrl('en')).toBe('http://localhost:3002/en');
  });

  it('points to the company profile in the same language', () => {
    expect(companyUrl('en', '/about')).toBe('http://localhost:3000/en/about');
  });

  it('only builds WhatsApp links when a number is configured', () => {
    expect(whatsappUrl('Halo', '')).toBeNull();
    expect(whatsappUrl('Halo', '+62 812-0000')).toBe('https://wa.me/628120000?text=Halo');
  });

  it('encodes mailto fields', () => {
    expect(mailtoUrl('a@b.co', 'Proposal sekolah', 'Halo & salam')).toBe(
      'mailto:a@b.co?subject=Proposal%20sekolah&body=Halo%20%26%20salam',
    );
  });
});
