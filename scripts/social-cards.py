"""Draws the store's social cards (1200 x 630) into public/og/ with the app's own fonts and photos.

    pip install playwright && python -m playwright install chromium
    python3 apps/store/scripts/social-cards.py

Run it again after renaming the brand (and regenerating the wordmark), or when a robot's name,
tagline, age, or level changes in packages/catalog. The text below mirrors the catalogue.
"""

import base64
import glob
import os
import re
import sys

from playwright.sync_api import sync_playwright

APP = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
ROOT = os.path.abspath(os.path.join(APP, '..', '..'))
OUT = os.path.join(APP, 'public', 'og')

SITE = {
    'id': {
        'tagline': 'Robot untuk diulik.',
        'promise': 'Robot bernama dan bernomor, lengkap dengan jalur belajar online gratis.',
        'development': 'Sedang dikembangkan',
        'soon': 'Segera hadir',
    },
    'en': {
        'tagline': 'Robots made for tinkering.',
        'promise': 'Named, numbered robots, each with a free online learning path.',
        'development': 'In development',
        'soon': 'Coming soon',
    },
}

ROBOTS = [
    {
        'slug': 'ciko',
        'number': 1,
        'name': 'Ciko',
        'image': 'ciko.webp',
        'colour': '#e3262d',
        'tagline': {
            'id': 'Mobil robot pertama: siap pakai, tinggal diprogram',
            'en': 'A first robot car: ready to go, just program it',
        },
        'chips': {'id': ['Usia 7+', 'Pemula'], 'en': ['Ages 7+', 'Beginner']},
    },
    {
        'slug': 'momo',
        'number': 2,
        'name': 'Momo',
        'image': 'momo.webp',
        # A photo with its own backdrop: it fills the frame instead of sitting on white.
        'scene': True,
        'colour': '#22b3a3',
        'tagline': {
            'id': 'Robot modular yang bisa dirakit ulang jadi apa saja',
            'en': 'A modular robot you can rebuild into anything',
        },
        'chips': {'id': ['Usia 11+', 'Menengah'], 'en': ['Ages 11+', 'Intermediate']},
    },
]
IN_DEVELOPMENT = [{'number': 3, 'name': 'Garu'}]
NEXT_DROP = 4


def data_url(path: str, mime: str) -> str:
    with open(path, 'rb') as file:
        return f'data:{mime};base64,{base64.b64encode(file.read()).decode()}'


def font(pattern: str) -> str:
    matches = sorted(glob.glob(os.path.join(ROOT, 'node_modules', '.pnpm', pattern)))
    if not matches:
        sys.exit(f'Font not found ({pattern}): run pnpm install first.')
    return data_url(matches[-1], 'font/woff2')


def wordmark(colour: str) -> str:
    with open(os.path.join(ROOT, 'packages', 'ui', 'src', 'brand', 'wordmark-path.ts')) as file:
        source = file.read()
    view_box = re.search(r"wordmarkViewBox = '([^']+)'", source).group(1)
    path = re.search(r"wordmarkPath =\s*'([^']+)'", source).group(1)
    dot = re.search(r'cx: (-?\d+), cy: (-?\d+), r: (\d+)', source).groups()
    return (
        f'<svg viewBox="{view_box}" class="wordmark"><path d="{path}" fill="{colour}"/>'
        f'<circle cx="{dot[0]}" cy="{dot[1]}" r="{dot[2]}" fill="#ffb020"/></svg>'
    )


def head() -> str:
    anybody = font(
        '@fontsource-variable+anybody@*/node_modules/@fontsource-variable/anybody/files/'
        'anybody-latin-wdth-normal.woff2'
    )
    anybody_italic = font(
        '@fontsource-variable+anybody@*/node_modules/@fontsource-variable/anybody/files/'
        'anybody-latin-wdth-italic.woff2'
    )
    atkinson = font(
        '@fontsource-variable+atkinson-hyperlegible-next@*/node_modules/@fontsource-variable/'
        'atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-wght-normal.woff2'
    )
    return f"""<meta charset="utf-8"><style>
@font-face {{ font-family: Anybody; src: url({anybody}); font-stretch: 50% 150%; font-weight: 100 900; }}
@font-face {{ font-family: Anybody; font-style: italic; src: url({anybody_italic}); font-stretch: 50% 150%; font-weight: 100 900; }}
@font-face {{ font-family: Atkinson; src: url({atkinson}); font-weight: 200 800; }}
* {{ box-sizing: border-box; margin: 0; }}
body {{ width: 1200px; height: 630px; overflow: hidden; font-family: Atkinson, sans-serif;
  background-color: #1f2228; color: #fff;
  background-image: radial-gradient(rgb(255 255 255 / .035) 1px, transparent 1.5px),
    radial-gradient(rgb(255 255 255 / .025) 1px, transparent 1.5px);
  background-size: 9px 9px, 13px 13px; background-position: 0 0, 4px 6px; }}
.display {{ font-family: Anybody; font-stretch: 118%; font-weight: 820; letter-spacing: -.015em; line-height: .96; }}
.number {{ font-family: Anybody; font-style: italic; font-stretch: 132%; font-weight: 860; letter-spacing: -.02em; line-height: .9; }}
.plate {{ display: grid; place-items: center; border-radius: 999px; background: #fff; color: #191b20; border: 4px solid #191b20; }}
.tag {{ display: inline-block; white-space: nowrap; border-radius: 999px; padding: 6px 14px; font-weight: 700; font-size: 17px; }}
</style>"""


def site_card(locale: str) -> str:
    text = SITE[locale]
    slots = []
    for robot in ROBOTS:
        image = data_url(os.path.join(APP, 'src', 'assets', 'robots', robot['image']), 'image/webp')
        slots.append(f"""<div class="slot">
  <div class="plate" style="width:64px;height:64px;font-size:26px;position:absolute;top:-30px;left:16px;z-index:2"><span class="number">{robot['number']:02d}</span></div>
  <div class="card" style="border-bottom:8px solid {robot['colour']}">
    <div style="height:132px;background:#fff url({image}) center/{'cover' if robot.get('scene') else 'contain'} no-repeat"></div>
    <p class="number" style="color:#191b20;font-size:38px;padding:10px 14px 14px;border-top:1px solid #dadde3">{robot['name']}</p>
  </div></div>""")
    for robot in IN_DEVELOPMENT:
        slots.append(f"""<div class="slot">
  <div class="plate" style="width:64px;height:64px;font-size:26px;position:absolute;top:-30px;left:16px;z-index:2"><span class="number">{robot['number']:02d}</span></div>
  <div class="card ghost" style="border:3px dashed rgb(255 255 255 / .4)">
    <p class="number" style="font-size:38px">{robot['name']}</p>
    <span class="tag" style="background:#ffb020;color:#191b20;margin-top:10px">{text['development']}</span>
  </div></div>""")
    slots.append(f"""<div class="slot">
  <div class="plate" style="width:64px;height:64px;font-size:24px;position:absolute;top:-30px;left:16px;z-index:2"><span class="number">??</span></div>
  <div class="card ghost" style="border:3px dashed #ffb020">
    <p class="number" style="font-size:34px;white-space:nowrap">Drop #{NEXT_DROP:02d}</p>
    <span class="tag" style="background:#ffb020;color:#191b20;margin-top:10px">{text['soon']}</span>
  </div></div>""")
    return f"""<!doctype html><html><head>{head()}<style>
.wordmark {{ height: 64px; }}
.grid {{ position: absolute; left: 64px; right: 64px; top: 376px; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 22px; }}
.slot {{ position: relative; height: 200px; }}
.card {{ height: 100%; border-radius: 12px; overflow: hidden; background: #fff; }}
.ghost {{ background: transparent; display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-start; padding: 18px 20px; }}
</style></head><body>
<div style="position:absolute;left:64px;top:56px">{wordmark('#ffffff')}</div>
<h1 class="display" style="position:absolute;left:64px;top:152px;font-size:58px;white-space:nowrap">{text['tagline']}</h1>
<p style="position:absolute;left:64px;top:232px;width:620px;font-size:28px;line-height:1.4;color:rgb(255 255 255 / .75)">{text['promise']}</p>
<div class="grid">{''.join(slots)}</div>
</body></html>"""


def robot_card(robot: dict, locale: str) -> str:
    image = data_url(os.path.join(APP, 'src', 'assets', 'robots', robot['image']), 'image/webp')
    chips = ''.join(
        f'<span class="tag" style="background:{robot["colour"] if index == 0 else "rgb(255 255 255 / .12)"};'
        f'color:{"#191b20" if index == 0 and robot["slug"] == "momo" else "#fff"};font-size:22px;margin-right:10px">{chip}</span>'
        for index, chip in enumerate(robot['chips'][locale])
    )
    return f"""<!doctype html><html><head>{head()}<style>.wordmark {{ height: 52px; }}</style></head><body>
<div style="position:absolute;left:0;top:0;width:600px;height:630px;background:{'#cdd1d6' if robot.get('scene') else '#fff'} url({image}) center/{'contain' if robot.get('scene') else '82%'} no-repeat;border-bottom:12px solid {robot['colour']}"></div>
<div style="position:absolute;left:660px;top:62px;display:flex;align-items:center;gap:24px">
  <div class="plate" style="width:92px;height:92px;font-size:38px;border-color:#fff"><span class="number">{robot['number']:02d}</span></div>
  <p class="number" style="font-size:84px">{robot['name']}</p>
</div>
<p class="display" style="position:absolute;left:660px;top:200px;width:480px;font-size:38px;line-height:1.15;font-family:Atkinson;font-weight:700;font-stretch:100%">{robot['tagline'][locale]}</p>
<div style="position:absolute;left:660px;top:318px">{chips}</div>
<div style="position:absolute;left:660px;bottom:52px">{wordmark('#ffffff')}</div>
</body></html>"""


def main() -> None:
    os.makedirs(OUT, exist_ok=True)
    pages = {}
    for locale in SITE:
        pages[f'site-{locale}'] = site_card(locale)
        for robot in ROBOTS:
            pages[f"{robot['slug']}-{locale}"] = robot_card(robot, locale)
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        page = browser.new_page(viewport={'width': 1200, 'height': 630})
        for name, html in pages.items():
            page.set_content(html, wait_until='load')
            page.evaluate('document.fonts.ready')
            path = os.path.join(OUT, f'{name}.jpg')
            page.screenshot(path=path, type='jpeg', quality=88)
            print(f'wrote {path}')
        browser.close()


if __name__ == '__main__':
    main()
