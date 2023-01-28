export type Votes = Record<string, string[]>;

export function singleRankedVote(votes: Votes, destinations: string[]) {
  const scores: Record<string, number> = {};

  destinations.forEach((d) => {
    scores[d] = 0;
  });

  let numVotes = 0;
  Object.entries(votes).forEach(([_, destinations]) => {
    scores[destinations[0]]++;
    numVotes++;
  });

  const quota = Math.ceil(numVotes / 2);

  for (let [destination, score] of Object.entries(scores)) {
    if (score >= quota) {
      return destination;
    }
  }
}

type RoundOutcome =
  | WinnerDeclaredOutcome
  | TieDeclaredOutcome
  | EliminationOutcome;

type WinnerDeclaredOutcome = {
  type: "WINNER_DECLARED";
  winner: string;
};

type TieDeclaredOutcome = { type: "TIE_DECLARED"; winners: string[] };

type EliminationOutcome = { type: "ELIMINATION"; eliminated: string[] };

export function singleRankedVoteRound(
  votes: Votes,
  destinations: string[]
): RoundOutcome {
  const voteCount = countVotes(votes, destinations);

  const threshold = getWinningThreshold(voteCount);

  const winners = getDestinationsOverTheThreshold(voteCount, threshold);

  if (winners.length === 1) {
    // There was a single destination over the threshold, declare it the winner
    return winner(winners[0]);
  } else if (winners.length === 2) {
    // There are two destinations that split the vote 50/50, declare it a tie
    return tie(winners);
  }

  if (isEveryRemainingDestinationEqual(voteCount)) {
    return tie(destinations);
  }

  const eliminated = getEliminatedDestinations(voteCount);

  return elimination(eliminated);
}

// ---- Helpers ---- //

type VoteCount = Record<string, number>;

function countVotes(votes: Votes, destinations: string[]): VoteCount {
  const voteCount: Record<string, number> = {};

  destinations.forEach((d) => {
    voteCount[d] = 0;
  });

  Object.entries(votes)
    .filter(([_, destinations]) => destinations.length > 0)
    .forEach(([_, destinations]) => {
      voteCount[destinations[0]]++;
    });

  return voteCount;
}

function getDestinationsOverTheThreshold(
  voteCount: VoteCount,
  threshold: number
): string[] {
  return Object.entries(voteCount)
    .filter(([_, score]) => score >= threshold)
    .map(([d, _]) => d);
}

function getWinningThreshold(voteCount: VoteCount): number {
  const numVotes = Object.values(voteCount).reduce((sum, num) => sum + num, 0);

  return Math.ceil(numVotes / 2);
}

function isEveryRemainingDestinationEqual(voteCount: VoteCount): boolean {
  const referenceScore = Object.values(voteCount)[0];

  return Object.values(voteCount).every((score) => score === referenceScore);
}

function getEliminatedDestinations(voteCount: VoteCount): string[] {
  const min = Math.min(...Object.values(voteCount));

  return Object.entries(voteCount)
    .filter(([_, score]) => score === min)
    .map(([d, _]) => d);
}

function winner(winner: string): WinnerDeclaredOutcome {
  return { type: "WINNER_DECLARED", winner };
}

function tie(winners: string[]): TieDeclaredOutcome {
  return { type: "TIE_DECLARED", winners };
}

function elimination(eliminated: string[]): EliminationOutcome {
  return { type: "ELIMINATION", eliminated };
}
