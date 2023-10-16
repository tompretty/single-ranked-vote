// ---- Types ---- //

interface SingleRankedVoteConfig<Option extends string, Person extends string> {
	options: Option[];
	votes: Vote<Option, Person>[];
}

interface Vote<Option extends string, Person extends string> {
	person: Person;
	preferences: Option[];
}

type SingleRankedVoteRoundOutcome<Option extends string> =
	| { eliminated: Option[]; kind: "elimination" }
	| { kind: "tie"; winners: Option[] }
	| { kind: "winner"; winner: Option };

type RoundVoteCounts<Option extends string> = Record<Option, number>;

// ---- Vote ---- //

export function vote<const Option extends string, Person extends string>(
	config: SingleRankedVoteConfig<Option, Person>,
): SingleRankedVoteRoundOutcome<Option>[] {
	const outcomes: SingleRankedVoteRoundOutcome<Option>[] = [];

	let currentConfig = config;
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	while (true) {
		const roundOutcome = voteRound(currentConfig);
		outcomes.push(roundOutcome);

		if (roundOutcome.kind === "winner" || roundOutcome.kind === "tie") {
			break;
		}

		currentConfig = removeEliminatedOptions(
			currentConfig,
			roundOutcome.eliminated,
		);
	}

	return outcomes;
}

// ---- Round ---- //

export function voteRound<const Option extends string, Person extends string>(
	config: SingleRankedVoteConfig<Option, Person>,
): SingleRankedVoteRoundOutcome<Option> {
	const counts = countRoundVotes(config);

	const threshold = getWinningThreshold(counts);

	const winner = getOptionOverThreshold(counts, threshold);

	if (winner) {
		return { kind: "winner", winner };
	}

	if (isVoteSplitEqually(counts)) {
		return { kind: "tie", winners: config.options };
	}

	const eliminated = getEliminatedOptions(counts);
	return { eliminated, kind: "elimination" };
}

// ---- Helpers ---- //

function countRoundVotes<Option extends string, Person extends string>(
	config: SingleRankedVoteConfig<Option, Person>,
): RoundVoteCounts<Option> {
	const counts = Object.fromEntries(
		config.options.map((option) => [option, 0]),
	) as RoundVoteCounts<Option>;

	config.votes
		.filter((v) => v.preferences.length > 0)
		.forEach((v) => {
			const option = v.preferences[0];
			counts[option] += +1;
		});

	return counts;
}

function getOptionOverThreshold<Option extends string>(
	counts: RoundVoteCounts<Option>,
	threshold: number,
): Option | undefined {
	const entries = Object.entries(counts) as [Option, number][];
	for (const [option, count] of entries) {
		if (count >= threshold) {
			return option;
		}
	}
}

function isVoteSplitEqually<Option extends string>(
	counts: RoundVoteCounts<Option>,
): boolean {
	const numVotes = Object.values<number>(counts);
	const result = numVotes.slice(1).every((n) => n === numVotes[0]);
	return result;
}

function removeEliminatedOptions<Option extends string, Person extends string>(
	config: SingleRankedVoteConfig<Option, Person>,
	eliminated: Option[],
): SingleRankedVoteConfig<Option, Person> {
	const updatedOptions = config.options.filter(
		(option) => !eliminated.includes(option),
	);
	const updatedVotes = config.votes.map((v) => {
		const updatedVote: Vote<Option, Person> = {
			...v,
			preferences: v.preferences.filter((d) => !eliminated.includes(d)),
		};

		return updatedVote;
	});

	return { options: updatedOptions, votes: updatedVotes };
}

function getWinningThreshold<Option extends string>(
	counts: RoundVoteCounts<Option>,
): number {
	const numVotes = Object.values<number>(counts).reduce(
		(sum, num) => sum + num,
		0,
	);

	return Math.floor(numVotes / 2) + 1;
}

function getEliminatedOptions<Option extends string>(
	counts: RoundVoteCounts<Option>,
): Option[] {
	const min = Math.min(...Object.values<number>(counts));

	const entries = Object.entries(counts) as [Option, number][];
	const eliminated = entries
		.filter(([, count]) => count === min)
		.map(([option]) => option);

	return eliminated;
}
