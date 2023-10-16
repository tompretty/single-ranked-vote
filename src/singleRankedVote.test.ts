import { describe, expect, it } from "vitest";

import { vote, voteRound } from "./singleRankedVote.js";

describe("singleRankedVote", () => {
	it("declares a winner if an option gets more than 50% of the vote", () => {
		const outcome = vote({
			options: ["O1", "O2"],
			votes: [
				{ person: "P1", preferences: ["O1"] },
				{ person: "P2", preferences: ["O1"] },
				{ person: "P3", preferences: ["O2"] },
			],
		});

		expect(outcome).toEqual([{ kind: "winner", winner: "O1" }]);
	});

	it("does multiple rounds of voting if there is no initial majority", () => {
		const outcome = vote({
			options: ["O1", "O2", "O3"],
			votes: [
				{ person: "P1", preferences: ["O1"] },
				{ person: "P2", preferences: ["O1"] },
				{ person: "P3", preferences: ["O2"] },
				{ person: "P4", preferences: ["O2"] },
				{ person: "P5", preferences: ["O3", "O1"] },
			],
		});

		expect(outcome).toEqual([
			{ eliminated: ["O3"], kind: "elimination" },
			{ kind: "winner", winner: "O1" },
		]);
	});
});

describe("singleRankedVoteRound", () => {
	it("declares a winner when there is an option with a majority", () => {
		const outcome = voteRound({
			options: ["O1", "O2"],
			votes: [
				{ person: "P1", preferences: ["O1"] },
				{ person: "P2", preferences: ["O1"] },
				{ person: "P3", preferences: ["O2"] },
			],
		});

		expect(outcome).toEqual({ kind: "winner", winner: "O1" });
	});

	it("declares a tie when the remaining options split the vote", () => {
		const outcome = voteRound({
			options: ["O1", "O2", "O3"],
			votes: [
				{ person: "P1", preferences: ["O1"] },
				{ person: "P2", preferences: ["O2"] },
				{ person: "P3", preferences: ["O3"] },
			],
		});

		expect(outcome).toEqual({
			kind: "tie",
			winners: ["O1", "O2", "O3"],
		});
	});

	it("eliminates all the options with the least votes if there is no majority", () => {
		const outcome = voteRound({
			options: ["O1", "O2", "O3", "O4", "O5"],
			votes: [
				{ person: "P1", preferences: ["O1"] },
				{ person: "P2", preferences: ["O2"] },
				{ person: "P3", preferences: ["O3"] },
			],
		});

		expect(outcome).toEqual({
			eliminated: ["O4", "O5"],
			kind: "elimination",
		});
	});

	it("does not consider 50% of the vote a winner", () => {
		const outcome = voteRound({
			options: ["O1", "O2", "O3"],
			votes: [
				{ person: "P1", preferences: ["O1"] },
				{ person: "P2", preferences: ["O1"] },
				{ person: "P3", preferences: ["O1"] },
				{ person: "P4", preferences: ["O2"] },
				{ person: "P5", preferences: ["O2"] },
				{ person: "P6", preferences: ["O3"] },
			],
		});

		expect(outcome).toEqual({ eliminated: ["O3"], kind: "elimination" });
	});

	it("ignores people with no votes left", () => {
		const outcome = voteRound({
			options: ["O1", "O2"],
			votes: [
				{ person: "P1", preferences: [] },
				{ person: "P2", preferences: ["O1"] },
				{ person: "P3", preferences: ["O2"] },
			],
		});

		expect(outcome).toEqual({
			kind: "tie",
			winners: ["O1", "O2"],
		});
	});
});
