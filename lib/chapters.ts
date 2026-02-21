export interface Chapter {
  year: number;
  title: string;
  subtitle: string;
}

export const CHAPTERS: Chapter[] = [
  {
    year: -3000,
    title: "Dawn of Civilization",
    subtitle: "The first empires emerge along great rivers",
  },
  {
    year: -500,
    title: "The Classical World",
    subtitle: "Philosophy, democracy, and empire",
  },
  {
    year: 1,
    title: "Imperial Consolidation",
    subtitle: "Rome and Han shape the known world",
  },
  {
    year: 500,
    title: "Late Antiquity",
    subtitle: "Empires transform and fragment",
  },
  {
    year: 1500,
    title: "The Early Modern Era",
    subtitle: "Gunpowder, trade, and global conquest",
  },
];

/**
 * Returns the index of the chapter whose threshold the given year
 * has reached or passed. Binary-search-style reverse scan — O(n)
 * on a tiny array, but the pattern generalizes to hundreds of chapters.
 *
 * Returns -1 if year is before the first chapter.
 */
export function getChapterIndex(year: number): number {
  for (let i = CHAPTERS.length - 1; i >= 0; i--) {
    if (year >= CHAPTERS[i].year) return i;
  }
  return -1;
}
