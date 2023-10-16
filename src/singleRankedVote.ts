// ---- Types ---- //

interface SingleRankedVoteConfig<
	Destination extends string,
	Person extends string,
> {
	destinations: Destination[];
	votes: Vote<Person, Destination>[];
}

interface Vote<Person extends string, Destination extends string> {
	destinations: Destination[];
	person: Person;
}

type SingleRankedVoteRoundOutcome<Destination extends string> =
	| { eliminated: Destination[]; kind: "elimination" }
	| { kind: "tie"; winners: Destination[] }
	| { kind: "winner"; winner: Destination };

type RoundVoteCounts<Destination extends string> = Record<Destination, number>;

// ---- Vote ---- //

export function vote<const Destination extends string, Person extends string>(
	config: SingleRankedVoteConfig<Destination, Person>,
): SingleRankedVoteRoundOutcome<Destination>[] {
	const outcomes: SingleRankedVoteRoundOutcome<Destination>[] = [];

	let currentConfig = config;
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	while (true) {
		const roundOutcome = voteRound(currentConfig);
		outcomes.push(roundOutcome);

		if (roundOutcome.kind === "winner" || roundOutcome.kind === "tie") {
			break;
		}

		currentConfig = removeEliminatedDestinations(
			currentConfig,
			roundOutcome.eliminated,
		);
	}

	return outcomes;
}

// ---- Round ---- //

export function voteRound<
	const Destination extends string,
	Person extends string,
>(
	config: SingleRankedVoteConfig<Destination, Person>,
): SingleRankedVoteRoundOutcome<Destination> {
	const counts = countRoundVotes(config);

	const threshold = getWinningThreshold(counts);

	const winner = getDestinationOverThreshold(counts, threshold);

	if (winner) {
		return { kind: "winner", winner };
	}

	if (isVoteSplitEqually(counts)) {
		return { kind: "tie", winners: config.destinations };
	}

	const eliminated = getEliminatedDestinations(counts);
	return { eliminated, kind: "elimination" };
}

// ---- Helpers ---- //

function countRoundVotes<
	const Destination extends string,
	Person extends string,
>(
	config: SingleRankedVoteConfig<Destination, Person>,
): RoundVoteCounts<Destination> {
	const counts = Object.fromEntries(
		config.destinations.map((d) => [d, 0]),
	) as RoundVoteCounts<Destination>;

	config.votes
		.filter((v) => v.destinations.length > 0)
		.forEach((v) => {
			const destination = v.destinations[0];
			counts[destination] += +1;
		});

	return counts;
}

function getDestinationOverThreshold<Destination extends string>(
	counts: RoundVoteCounts<Destination>,
	threshold: number,
): Destination | undefined {
	const entries = Object.entries(counts) as [Destination, number][];
	for (const [destination, count] of entries) {
		if (count >= threshold) {
			return destination;
		}
	}
}

function isVoteSplitEqually<Destination extends string>(
	counts: RoundVoteCounts<Destination>,
): boolean {
	const numVotes = Object.values<number>(counts);
	const result = numVotes.slice(1).every((n) => n === numVotes[0]);
	return result;
}

function removeEliminatedDestinations<
	const Destination extends string,
	Person extends string,
>(
	config: SingleRankedVoteConfig<Destination, Person>,
	eliminated: Destination[],
): SingleRankedVoteConfig<Destination, Person> {
	const updatedDestinations = config.destinations.filter(
		(d) => !eliminated.includes(d),
	);
	const updatedVotes = config.votes.map((v) => {
		const updatedVote: Vote<Person, Destination> = {
			...v,
			destinations: v.destinations.filter((d) => !eliminated.includes(d)),
		};

		return updatedVote;
	});

	return { destinations: updatedDestinations, votes: updatedVotes };
}

function getWinningThreshold<Destination extends string>(
	counts: RoundVoteCounts<Destination>,
): number {
	const numVotes = Object.values<number>(counts).reduce(
		(sum, num) => sum + num,
		0,
	);

	return Math.floor(numVotes / 2) + 1;
}

function getEliminatedDestinations<Destination extends string>(
	counts: RoundVoteCounts<Destination>,
): Destination[] {
	const min = Math.min(...Object.values<number>(counts));

	const entries = Object.entries(counts) as [Destination, number][];
	const eliminated = entries
		.filter(([, count]) => count === min)
		.map(([d]) => d);

	return eliminated;
}
