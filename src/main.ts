import { vote } from "./singleRankedVote.js";

const outcome = vote({
	destinations: [
		"Cyrpus",
		"Spain",
		"Turkey",
		"Portugal",
		"Tunisia",
		"North Macedonia",
		"Cape Verde",
		"Iceland",
	],
	votes: [
		{ destinations: ["Spain", "Portugal"], person: "Dylan" },
		{ destinations: ["Turkey", "Spain", "Portugal"], person: "Emily" },
		{ destinations: ["Turkey", "Spain", "Portugal"], person: "Jay" },
		{ destinations: ["Turkey", "Spain", "Portugal"], person: "Susanna" },
		{ destinations: ["Spain", "Portugal", "Turkey"], person: "Tom" },
	],
});

console.dir({ outcome }, { depth: null });
