import type { Localized, RobotSlug } from '@dctedu/catalog';
import type { StaticImageData } from 'next/image';
import ciko from '@/assets/robots/ciko.webp';
import momoLine from '@/assets/robots/momo-line.webp';
import momoMonitor from '@/assets/robots/momo-monitor.webp';
import momoObstacle from '@/assets/robots/momo-obstacle.webp';
import momoParts from '@/assets/robots/momo-parts.webp';
import momoPcb from '@/assets/robots/momo-pcb.webp';
import momoVoice from '@/assets/robots/momo-voice.webp';

const l = (id: string, en: string): Localized => ({ id, en });

export interface RobotImage {
  src: StaticImageData;
  alt: Localized;
  /** A render with its own background, which fills the frame instead of sitting on white. */
  scene?: boolean;
}

/** Product shots sit on white with room around them; scenes fill the frame. */
export function imageFit(image: RobotImage, padding: string): string {
  return image.scene ? 'object-cover' : `object-contain ${padding}`;
}

/** The main picture of each robot, on a white background. */
export const robotImages: Record<RobotSlug, RobotImage> = {
  ciko: {
    src: ciko,
    alt: l(
      'Ciko: robot mobil merah bergaris putih dengan mata OLED, sensor jarak di bumper, dan dua lampu sein oranye',
      'Ciko: a red robot car with a white stripe, OLED eyes, a distance sensor in its bumper, and two orange turn signals',
    ),
  },
  momo: {
    src: momoMonitor,
    alt: l(
      'Momo: robot modular berangka merah dengan roda kuning, mata OLED biru, dan sensor ultrasonik di atasnya',
      'Momo: a modular robot with a red frame, yellow wheels, blue OLED eyes, and an ultrasonic sensor on top',
    ),
  },
};

/** Momo's four builds, the parts, and the board, for its page. */
export const momoGallery: { id: string; src: StaticImageData; caption: Localized }[] = [
  { id: 'line', src: momoLine, caption: l('Pengikut garis', 'Line follower') },
  { id: 'obstacle', src: momoObstacle, caption: l('Penghindar rintangan', 'Obstacle avoider') },
  { id: 'voice', src: momoVoice, caption: l('Kendali suara', 'Sound control') },
  { id: 'monitor', src: momoMonitor, caption: l('Stasiun pemantau', 'Monitoring station') },
];

export const momoBoard = {
  parts: { src: momoParts, alt: l('Modul-modul Momo', 'Momo’s modules') },
  pcb: { src: momoPcb, alt: l('PCB kustom Momo dengan ESP32', 'Momo’s custom PCB with its ESP32') },
};
