import { describe, it, expect } from "@jest/globals";
import { singleRankedVote, singleRankedVoteRound, Votes } from "./main";

describe("singleRankedVote", () => {
  it("declares a winner if a destination gets more than 50% of the vote", () => {
    const votes: Votes = {
      Tom: ["Spain"],
      Emily: ["Spain"],
      Dylan: ["Cyprus"],
    };
    const destinations = ["Spain", "Cyprus"];

    const outcome = singleRankedVote(votes, destinations);

    expect(outcome).toEqual([{ type: "WINNER_DECLARED", winner: "Spain" }]);
  });

  it("does multiple rounds of voting if there is no initial majority", () => {
    const votes: Votes = {
      Tom: ["Spain"],
      Emily: ["Spain"],
      Dylan: ["Cyprus"],
      Susanna: ["Cyprus"],
      Jay: ["Turkey", "Spain"],
    };
    const destinations = ["Spain", "Cyprus", "Turkey"];

    const outcome = singleRankedVote(votes, destinations);

    expect(outcome).toEqual([
      { type: "ELIMINATION", eliminated: ["Turkey"] },
      { type: "WINNER_DECLARED", winner: "Spain" },
    ]);
  });
});

describe("singleRankedVoteRound", () => {
  it("declares a winner when there is a destination with a majority", () => {
    const votes: Votes = {
      Tom: ["Spain"],
      Emily: ["Spain"],
      Dylan: ["Cyprus"],
    };
    const destinations = ["Spain", "Cyprus"];

    const outcome = singleRankedVoteRound(votes, destinations);

    expect(outcome).toEqual({ type: "WINNER_DECLARED", winner: "Spain" });
  });

  it("declares a tie when there are two destinations that share 50% of the vote", () => {
    const votes: Votes = {
      Tom: ["Spain"],
      Emily: ["Cyprus"],
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
      Tom: ["Spain"],
      Emily: ["Cyprus"],
      Dylan: ["Turkey"],
    };
    const destinations = ["Spain", "Cyprus", "Turkey", "Portugal", "Tunisia"];

    const outcome = singleRankedVoteRound(votes, destinations);

    expect(outcome).toEqual({
      type: "ELIMINATION",
      eliminated: ["Portugal", "Tunisia"],
    });
  });

  it("declares a tie if all the remaining destinations split the vote equally", () => {
    const votes: Votes = {
      Tom: ["Spain"],
      Emily: ["Cyprus"],
      Dylan: ["Turkey"],
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
      Tom: ["Spain"],
      Emily: ["Cyprus"],
      Dylan: [],
    };
    const destinations = ["Spain", "Cyprus"];

    const outcome = singleRankedVoteRound(votes, destinations);

    expect(outcome).toEqual({
      type: "TIE_DECLARED",
      winners: ["Spain", "Cyprus"],
    });
  });
});
