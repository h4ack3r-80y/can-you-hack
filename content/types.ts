// Curriculum content schema. All learning content is data in this shape.
// The founder can edit it via /admin (stored as ContentOverride rows) or by
// editing the files in content/paths/ directly.

export interface QuizQuestion {
  q: string;
  options: string[]; // 4 options
  answer: number; // index of correct option
  explain: string; // shown after answering
}

export type LabCheck =
  | { kind: "flag"; flag: string; hint: string } // sim engine flag, e.g. "vsftpd_root"
  | { kind: "answer"; answers: string[]; hint: string } // free-text answer (case-insensitive)
  | { kind: "manual"; hint: string }; // student marks complete (capstones)

export interface LabObjective {
  id: string;
  text: string;
  check: LabCheck;
}

export interface Module {
  id: string;
  title: string;
  minutes: number;
  outcomes: string[]; // "You will be able to…"
  lesson: string; // markdown
  labIntro: string;
  objectives: LabObjective[];
  /** which simulator surface the lab uses */
  labKind: "terminal" | "packets" | "mixed";
  /** for packet labs: which capture dataset to open */
  captureId?: string;
  quiz: QuizQuestion[];
}

export interface Path {
  id: string;
  title: string;
  level: "Beginner" | "Intermediate";
  track: "Pentesting" | "Forensics" | "Network Analysis";
  tagline: string;
  modules: Module[];
}

export const PASS_MARK = 80;
