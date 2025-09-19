export interface BibleShot {
  id: number;
  reference: string;
  verset: string;
  punchline: string;
}

export interface UsedShotsData {
  year: number;
  usedIds: number[];
}