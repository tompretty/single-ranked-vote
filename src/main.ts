type GroupMember = "Tom" | "Emily" | "Dylan" | "Susanna" | "Jay";

type Destination = "Cyprus" | "Spain" | "Turkey";

export type Votes = {
  [member in GroupMember]: Destination[];
};

export function singleRankedVote(votes: Votes) {
  const scores = {
    Cyprus: 0,
    Spain: 0,
    Turkey: 0,
  };

  Object.entries(votes).forEach(([_, destinations]) => {
    scores[destinations[0]] += 1;
  });

  const quota = 3;

  for (let [destination, score] of Object.entries(scores)) {
    if (score >= quota) {
      return destination;
    }
  }
}

type RoundOutcome =
  | {
      type: "WINNER_DECLARED";
      winner: Destination;
    }
  | { type: "ELIMINATION"; eliminated: Destination[] };

export function singleRankedVoteRound(votes: Votes): RoundOutcome {
  const scores = {
    Cyprus: 0,
    Spain: 0,
    Turkey: 0,
  };

  Object.entries(votes).forEach(([_, destinations]) => {
    scores[destinations[0]] += 1;
  });

  const quota = 3;

  for (let [destination, score] of Object.entries(scores)) {
    if (score >= quota) {
      return { type: "WINNER_DECLARED", winner: destination as Destination };
    }
  }

  const min = Math.min(...Object.values(scores));

  const eliminated: Destination[] = [];

  for (let [destination, score] of Object.entries(scores)) {
    if (score === min) {
      eliminated.push(destination as Destination);
    }
  }

  return { type: "ELIMINATION", eliminated };
}
