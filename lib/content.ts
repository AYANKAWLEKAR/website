export const owner = {
  name: "Ayan Kawlekar",
  positioning:
    "I build AI agents, machine-learning systems, and full-stack products — applied mathematics at UC Berkeley.",
  location: "Berkeley, California",
  interests: "AI/ML · robotics · finance · startups",
  currently: "Placeholder — current focus goes here",
  email: "emailayankawlekar@gmail.com",
  github: "https://github.com/AYANKAWLEKAR",
  linkedin: "#", // TODO: add LinkedIn profile URL
};

export type ExperienceEntry = {
  role: string;
  organization: string;
  dates: string;
  summary: string;
  detail: string;
};

export const experience: ExperienceEntry[] = [
  {
    role: "Placeholder Role",
    organization: "Placeholder Organization",
    dates: "May 20XX — Aug 20XX",
    summary:
      "Placeholder: one clear sentence about what was built or achieved in this role.",
    detail:
      "Placeholder: one concise detail on scale, outcome, or technical depth.",
  },
  {
    role: "Placeholder Role",
    organization: "Placeholder Organization",
    dates: "Jan 20XX — May 20XX",
    summary:
      "Placeholder: one clear sentence about what was built or achieved in this role.",
    detail:
      "Placeholder: one concise detail on scale, outcome, or technical depth.",
  },
  {
    role: "Placeholder Role",
    organization: "Placeholder Organization",
    dates: "Sep 20XX — Dec 20XX",
    summary:
      "Placeholder: one clear sentence about what was built or achieved in this role.",
    detail:
      "Placeholder: one concise detail on scale, outcome, or technical depth.",
  },
  {
    role: "Placeholder Role",
    organization: "Placeholder Organization",
    dates: "Jun 20XX — Aug 20XX",
    summary:
      "Placeholder: one clear sentence about what was built or achieved in this role.",
    detail:
      "Placeholder: one concise detail on scale, outcome, or technical depth.",
  },
];

export type ProjectEntry = {
  index: string;
  title: string;
  thesis: string;
  stack: string;
  outcome: string;
};

export const projects: ProjectEntry[] = [
  {
    index: "01",
    title: "Placeholder Project",
    thesis:
      "Placeholder: a one-sentence thesis for what this project proves or explores.",
    stack: "Python · PyTorch · Placeholder",
    outcome: "Placeholder: the result or meaningful outcome of the work.",
  },
  {
    index: "02",
    title: "Placeholder Project",
    thesis:
      "Placeholder: a one-sentence thesis for what this project proves or explores.",
    stack: "TypeScript · Next.js · Placeholder",
    outcome: "Placeholder: the result or meaningful outcome of the work.",
  },
  {
    index: "03",
    title: "Placeholder Project",
    thesis:
      "Placeholder: a one-sentence thesis for what this project proves or explores.",
    stack: "Placeholder · Placeholder",
    outcome: "Placeholder: the result or meaningful outcome of the work.",
  },
];

export const about = {
  paragraphs: [
    "Placeholder: background and technical direction — where you come from mathematically and what kinds of problems pull you in.",
    "Placeholder: the kinds of systems and products you build — agents, ML/data systems, full-stack tools — and how you approach building them.",
    "Placeholder: current intellectual interests — what you are reading, studying, or circling right now.",
  ],
  now: [
    "Placeholder: a current project or experiment.",
    "Placeholder: something you are learning or researching.",
    "Placeholder: something you are reading.",
  ],
};
