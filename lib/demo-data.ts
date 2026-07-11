import type { Matchup } from "@/types/content";

export const latestEdition = {
  slug: "bad-decisions-worse-excuses",
  title: "Bad Decisions, Worse Excuses",
  subtitle: "Another week of fantasy football presented with more confidence than competence."
};

export const demoMatchups: Matchup[] = [
  {
    id: "one",
    winner: "Ben and Blair",
    loser: "Chuck",
    winnerScore: 171.22,
    loserScore: 113.64,
    headline: "Chuck Discovers a Fresh Route to Public Humiliation",
    story: "The winners handled their business while the loser spent Sunday investigating whether projections can be charged with fraud."
  },
  {
    id: "two",
    winner: "Chris",
    loser: "Brad",
    winnerScore: 136.30,
    loserScore: 132.42,
    headline: "Chris Escapes Basement, Immediately Begins Talking",
    story: "One victory was apparently all the authorization required for a full return to unbearable confidence."
  },
  {
    id: "three",
    winner: "Doug",
    loser: "Warren",
    winnerScore: 135.88,
    loserScore: 116.04,
    headline: "Sibling Rivalry Ends in Avoidable Family Tension",
    story: "Doug secured temporary family supremacy and a deeply uncomfortable next gathering."
  }
];
