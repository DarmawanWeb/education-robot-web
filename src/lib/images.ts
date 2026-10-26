import type { Localized, RobotSlug } from '@dctedu/catalog';
import type { StaticImageData } from 'next/image';
import ciko from '@/assets/robots/ciko.webp';
import momo from '@/assets/robots/momo.webp';

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
    src: momo,
    scene: true,
    alt: l(
      'Momo: robot modular berangka abu gelap dengan roda putih, board penuh konektor di atasnya, dan sensor ultrasonik di dudukan teal',
      'Momo: a modular robot with a dark grey frame, white wheels, a board full of connectors on top, and an ultrasonic sensor in a teal mount',
    ),
  },
};
