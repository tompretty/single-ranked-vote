import { describe, it, expect } from "@jest/globals";
import { singleRankedVote, singleRankedVoteRound, Votes } from "./main";

describe("singleRankedVote", () => {
  it("declares a winner if a destination gets more than 50% of the vote", () => {
    const votes: Votes = {
      Tom: ["Spain", "Cyprus"],
      Emily: ["Spain", "Cyprus"],
      Dylan: ["Spain", "Cyprus"],
      Susanna: ["Cyprus", "Spain"],
      Jay: ["Cyprus", "Spain"],
    };

    const winner = singleRankedVote(votes);

    expect(winner).toEqual("Spain");
  });

  it("does multiple rounds of voting if there is no initial majority", () => {
    const votes: Votes = {
      Tom: ["Spain", "Cyprus"],
      Emily: ["Spain", "Cyprus"],
      Dylan: ["Cyprus", "Spain"],
      Susanna: ["Cyprus", "Spain"],
      Jay: ["Turkey", "Spain"],
    };

    const winner = singleRankedVote(votes);

    expect(winner).toEqual("Spain");
  });
});

describe("singleRankedVoteRound", () => {
  it("declares a winner when there is a destination with a majority", () => {
    const votes: Votes = {
      Tom: ["Spain"],
      Emily: ["Spain"],
      Dylan: ["Spain"],
      Susanna: ["Cyprus"],
      Jay: ["Cyprus"],
    };

    const outcome = singleRankedVoteRound(votes);

    expect(outcome).toEqual({ type: "WINNER_DECLARED", winner: "Spain" });
  });

  it("eliminates the all destinations with the least votes if there is no majority", () => {
    const votes: Votes = {
      Tom: ["Spain"],
      Emily: ["Spain"],
      Dylan: ["Cyprus"],
      Susanna: ["Cyprus"],
      Jay: ["Turkey"],
    };

    const outcome = singleRankedVoteRound(votes);

    expect(outcome).toEqual({ type: "ELIMINATION", eliminated: ["Turkey"] });
  });
});
