import { describe, expect, it } from "vitest";

import {
	Votes,
	singleRankedVote,
	singleRankedVoteRound,
} from "./singleRankedVote.js";

describe("singleRankedVote", () => {
	it("declares a winner if a destination gets more than 50% of the vote", () => {
		const votes: Votes = {
			Dylan: ["Cyprus"],
			Emily: ["Spain"],
			Tom: ["Spain"],
		};
		const destinations = ["Spain", "Cyprus"];

		const outcome = singleRankedVote(votes, destinations);

		expect(outcome).toEqual([{ type: "WINNER_DECLARED", winner: "Spain" }]);
	});

	it("does multiple rounds of voting if there is no initial majority", () => {
		const votes: Votes = {
			Dylan: ["Cyprus"],
			Emily: ["Spain"],
			Jay: ["Turkey", "Spain"],
			Susanna: ["Cyprus"],
			Tom: ["Spain"],
		};
		const destinations = ["Spain", "Cyprus", "Turkey"];

		const outcome = singleRankedVote(votes, destinations);

		expect(outcome).toEqual([
			{ eliminated: ["Turkey"], type: "ELIMINATION" },
			{ type: "WINNER_DECLARED", winner: "Spain" },
		]);
	});
});

describe("singleRankedVoteRound", () => {
	it("declares a winner when there is a destination with a majority", () => {
		const votes: Votes = {
			Dylan: ["Cyprus"],
			Emily: ["Spain"],
			Tom: ["Spain"],
		};
		const destinations = ["Spain", "Cyprus"];

		const outcome = singleRankedVoteRound(votes, destinations);

		expect(outcome).toEqual({ type: "WINNER_DECLARED", winner: "Spain" });
	});

	it("declares a tie when there are two destinations that share 50% of the vote", () => {
		const votes: Votes = {
			Emily: ["Cyprus"],
			Tom: ["Spain"],
		};
		const destinations = ["Spain", "Cyprus"];

		const outcome = singleRankedVoteRound(votes, destinations);

		expect(outcome).toEqual({
			type: "TIE_DECLARED",
			winners: ["Spain", "Cyprus"],
		});
	});

	it("eliminates the all destinations with the least votes if there is no majority", () => {
		const votes: Votes = {
			Dylan: ["Turkey"],
			Emily: ["Cyprus"],
			Tom: ["Spain"],
		};
		const destinations = ["Spain", "Cyprus", "Turkey", "Portugal", "Tunisia"];

		const outcome = singleRankedVoteRound(votes, destinations);

		expect(outcome).toEqual({
			eliminated: ["Portugal", "Tunisia"],
			type: "ELIMINATION",
		});
	});

	it("declares a tie if all the remaining destinations split the vote equally", () => {
		const votes: Votes = {
			Dylan: ["Turkey"],
			Emily: ["Cyprus"],
			Tom: ["Spain"],
		};
		const destinations = ["Spain", "Cyprus", "Turkey"];

		const outcome = singleRankedVoteRound(votes, destinations);

		expect(outcome).toEqual({
			type: "TIE_DECLARED",
			winners: ["Spain", "Cyprus", "Turkey"],
		});
	});

	it("ignores members with no votes left", () => {
		const votes: Votes = {
			Dylan: [],
			Emily: ["Cyprus"],
			Tom: ["Spain"],
		};
		const destinations = ["Spain", "Cyprus"];

		const outcome = singleRankedVoteRound(votes, destinations);

		expect(outcome).toEqual({
			type: "TIE_DECLARED",
			winners: ["Spain", "Cyprus"],
		});
	});
});
