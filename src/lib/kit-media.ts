import type { LevelSlug, Localized } from '@taksu/content';
import type { StaticImageData } from 'next/image';
import pcb from '@/assets/kits/pcb.webp';
import sdBack from '@/assets/kits/sd-back.webp';
import sdFront from '@/assets/kits/sd-front.webp';
import sdHero from '@/assets/kits/sd-hero.webp';
import sdSide from '@/assets/kits/sd-side.webp';
import sdTop from '@/assets/kits/sd-top.webp';
import smaHero from '@/assets/kits/sma-hero.webp';
import smpHero from '@/assets/kits/smp-hero.webp';
import smpLine from '@/assets/kits/smp-line.webp';
import smpMonitor from '@/assets/kits/smp-monitor.webp';
import smpObstacle from '@/assets/kits/smp-obstacle.webp';
import smpPartsImage from '@/assets/kits/smp-parts.webp';
import smpVoice from '@/assets/kits/smp-voice.webp';

export interface KitImage {
  src: StaticImageData;
  alt: Localized;
  /** Photos fill their frame; cut-outs on white sit inside it. */
  fit?: 'cover' | 'contain';
}

const l = (id: string, en: string): Localized => ({ id, en });

/** Concept renders supplied for each kit, cropped clean of the poster text. */
export const kitHero: Record<LevelSlug, KitImage> = {
  sd: {
    src: sdHero,
    alt: l(
      'SD v1: robot 2WD dengan wajah OLED dan sensor jarak',
      'SD v1: a 2WD robot with an OLED face and a distance sensor',
    ),
  },
  smp: {
    src: smpHero,
    fit: 'contain',
    alt: l('SMP v1 dalam empat konfigurasi modul', 'SMP v1 in four module configurations'),
  },
  sma: {
    src: smaHero,
    fit: 'cover',
    alt: l(
      'SMA v1: rover beroda rantai dengan kamera, komputer onboard, dan lengan robot',
      'SMA v1: a tracked rover with a camera, an onboard computer, and a robotic arm',
    ),
  },
};

export const kitGallery: Partial<Record<LevelSlug, KitImage[]>> = {
  sd: [
    { src: sdFront, fit: 'cover', alt: l('Tampak depan', 'Front') },
    { src: sdSide, fit: 'cover', alt: l('Tampak samping', 'Side') },
    { src: sdBack, fit: 'cover', alt: l('Tampak belakang', 'Back') },
    { src: sdTop, fit: 'cover', alt: l('Tampak atas', 'Top') },
  ],
  smp: [
    { src: smpLine, alt: l('Line follower', 'Line follower') },
    { src: smpObstacle, alt: l('Penghindar rintangan', 'Obstacle avoider') },
    { src: smpVoice, alt: l('Kendali suara', 'Voice control') },
    { src: smpMonitor, alt: l('Stasiun pemantau', 'Monitoring station') },
  ],
};

export const smpParts: KitImage = {
  src: smpPartsImage,
  alt: l('Komponen modular SMP v1 beserta namanya', 'SMP v1 modular parts with their names'),
};

export const customPcb: KitImage = {
  src: pcb,
  alt: l(
    'PCB kustom dengan ESP32 dan konektor modul',
    'Custom PCB with the ESP32 and module connectors',
  ),
};
