import { singleRankedVote, Votes } from "./singleRankedVote";

const votes: Votes = {
  Dylan: ["Spain", "Portugal"],
  Susanna: ["Turkey", "Spain", "Portugal"],
  Tom: ["Spain", "Portugal", "Turkey"],
  Emily: ["Turkey", "Spain", "Portugal"],
  Jay: ["Turkey", "Spain", "Portugal"],
};

const destinations = [
  "Cyrpus",
  "Spain",
  "Turkey",
  "Portugal",
  "Tunisia",
  "North Macedonia",
  "Cape Verde",
  "Iceland",
];

const outcome = singleRankedVote(votes, destinations);

console.dir({ outcome }, { depth: null });
