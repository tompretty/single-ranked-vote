export type Votes = Record<string, string[]>;

type RoundOutcome =
	| EliminationOutcome
	| TieDeclaredOutcome
	| WinnerDeclaredOutcome;

interface WinnerDeclaredOutcome {
	type: "WINNER_DECLARED";
	winner: string;
}

interface TieDeclaredOutcome {
	type: "TIE_DECLARED";
	winners: string[];
}

interface EliminationOutcome {
	eliminated: string[];
	type: "ELIMINATION";
}

export function singleRankedVote(
	votes: Votes,
	destinations: string[],
	outcomes: RoundOutcome[] = [],
): RoundOutcome[] {
	const outcome = singleRankedVoteRound(votes, destinations);

	const newOutcomes = [...outcomes, outcome];

	if (outcome.type === "WINNER_DECLARED" || outcome.type === "TIE_DECLARED") {
		return newOutcomes;
	}

	return singleRankedVote(
		removeEliminatedVotes(votes, outcome.eliminated),
		removeEliminatedDestinations(destinations, outcome.eliminated),
		newOutcomes,
	);
}

export function singleRankedVoteRound(
	votes: Votes,
	destinations: string[],
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
	const initialCounts = destinations.reduce<Record<string, number>>(
		(counts, d) => ({ ...counts, [d]: 0 }),
		{},
	);

	return Object.entries(votes)
		.filter(([, destinations]) => destinations.length > 0)
		.reduce<Record<string, number>>(
			(counts, [, destinations]) => ({
				...counts,
				[destinations[0]]: counts[destinations[0]] + 1,
			}),
			initialCounts,
		);
}

function getDestinationsOverTheThreshold(
	voteCount: VoteCount,
	threshold: number,
): string[] {
	return Object.entries(voteCount)
		.filter(([, score]) => score >= threshold)
		.map(([d]) => d);
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
		.filter(([, score]) => score === min)
		.map(([d]) => d);
}

function winner(winner: string): WinnerDeclaredOutcome {
	return { type: "WINNER_DECLARED", winner };
}

function tie(winners: string[]): TieDeclaredOutcome {
	return { type: "TIE_DECLARED", winners };
}

function elimination(eliminated: string[]): EliminationOutcome {
	return { eliminated, type: "ELIMINATION" };
}

function removeEliminatedVotes(votes: Votes, eliminated: string[]): Votes {
	return Object.fromEntries(
		Object.entries(votes).map(([member, ranking]) => [
			member,
			removeEliminatedDestinations(ranking, eliminated),
		]),
	);
}

function removeEliminatedDestinations(
	destinations: string[],
	eliminated: string[],
): string[] {
	return destinations.filter((d) => !eliminated.includes(d));
}
