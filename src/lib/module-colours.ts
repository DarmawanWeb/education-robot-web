/** Module colours shared by the meeting strip and the syllabus, distinct on the green mat. */
export const MODULE_COLOURS = [
  '#ffd23f',
  '#ff5a1f',
  '#ffffff',
  '#7fd6ff',
  '#a797ff',
  '#19b48a',
  '#ff9ec0',
  '#c8f169',
] as const;

export function moduleColour(index: number): string {
  return MODULE_COLOURS[index % MODULE_COLOURS.length] ?? MODULE_COLOURS[0];
}
