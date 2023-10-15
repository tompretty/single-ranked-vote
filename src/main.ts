import { Votes, singleRankedVote } from "./singleRankedVote.js";

const votes: Votes = {
	Dylan: ["Spain", "Portugal"],
	Emily: ["Turkey", "Spain", "Portugal"],
	Jay: ["Turkey", "Spain", "Portugal"],
	Susanna: ["Turkey", "Spain", "Portugal"],
	Tom: ["Spain", "Portugal", "Turkey"],
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
