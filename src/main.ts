import { vote } from "./singleRankedVote.js";

const outcome = vote({
	options: [
		"Cyprus",
		"Spain",
		"Turkey",
		"Portugal",
		"Tunisia",
		"North Macedonia",
		"Cape Verde",
		"Iceland",
	],
	votes: [
		{ person: "Dylan", preferences: ["Spain", "Portugal"] },
		{ person: "Emily", preferences: ["Turkey", "Spain", "Portugal"] },
		{ person: "Jay", preferences: ["Turkey", "Spain", "Portugal"] },
		{ person: "Susanna", preferences: ["Turkey", "Spain", "Portugal"] },
		{ person: "Tom", preferences: ["Spain", "Portugal", "Turkey"] },
	],
});

console.dir({ outcome }, { depth: null });
