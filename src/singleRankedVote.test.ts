import { describe, expect, it } from "vitest";

import { vote, voteRound } from "./singleRankedVote.js";

describe("singleRankedVote", () => {
	it("declares a winner if a destination gets more than 50% of the vote", () => {
		const outcome = vote({
			destinations: ["D1", "D2"],
			votes: [
				{ destinations: ["D1"], person: "P1" },
				{ destinations: ["D1"], person: "P2" },
				{ destinations: ["D2"], person: "P3" },
			],
		});

		expect(outcome).toEqual([{ kind: "winner", winner: "D1" }]);
	});

	it("does multiple rounds of voting if there is no initial majority", () => {
		const outcome = vote({
			destinations: ["D1", "D2", "D3"],
			votes: [
				{ destinations: ["D1"], person: "P1" },
				{ destinations: ["D1"], person: "P2" },
				{ destinations: ["D2"], person: "P3" },
				{ destinations: ["D2"], person: "P4" },
				{ destinations: ["D3", "D1"], person: "P5" },
			],
		});

		expect(outcome).toEqual([
			{ eliminated: ["D3"], kind: "elimination" },
			{ kind: "winner", winner: "D1" },
		]);
	});
});

describe("singleRankedVoteRound", () => {
	it("declares a winner when there is a destination with a majority", () => {
		const outcome = voteRound({
			destinations: ["D1", "D2"],
			votes: [
				{ destinations: ["D1"], person: "P1" },
				{ destinations: ["D1"], person: "P2" },
				{ destinations: ["D2"], person: "P3" },
			],
		});

		expect(outcome).toEqual({ kind: "winner", winner: "D1" });
	});

	it("declares a tie when the remaining destinations split the vote", () => {
		const outcome = voteRound({
			destinations: ["D1", "D2", "D3"],
			votes: [
				{ destinations: ["D1"], person: "P1" },
				{ destinations: ["D2"], person: "P2" },
				{ destinations: ["D3"], person: "P3" },
			],
		});

		expect(outcome).toEqual({
			kind: "tie",
			winners: ["D1", "D2", "D3"],
		});
	});

	it("eliminates the all destinations with the least votes if there is no majority", () => {
		const outcome = voteRound({
			destinations: ["D1", "D2", "D3", "D4", "D5"],
			votes: [
				{ destinations: ["D1"], person: "P1" },
				{ destinations: ["D2"], person: "P2" },
				{ destinations: ["D3"], person: "P3" },
			],
		});

		expect(outcome).toEqual({
			eliminated: ["D4", "D5"],
			kind: "elimination",
		});
	});

	it("does not consider 50% of the vote a winner", () => {
		const outcome = voteRound({
			destinations: ["D1", "D2", "D3"],
			votes: [
				{ destinations: ["D1"], person: "P1" },
				{ destinations: ["D1"], person: "P2" },
				{ destinations: ["D1"], person: "P3" },
				{ destinations: ["D2"], person: "P4" },
				{ destinations: ["D2"], person: "P5" },
				{ destinations: ["D3"], person: "P6" },
			],
		});

		expect(outcome).toEqual({ eliminated: ["D3"], kind: "elimination" });
	});

	it("ignores people with no votes left", () => {
		const outcome = voteRound({
			destinations: ["D1", "D2"],
			votes: [
				{ destinations: [], person: "P1" },
				{ destinations: ["D1"], person: "P2" },
				{ destinations: ["D2"], person: "P3" },
			],
		});

		expect(outcome).toEqual({
			kind: "tie",
			winners: ["D1", "D2"],
		});
	});
});
