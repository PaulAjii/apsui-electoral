import { StatusCodes } from 'http-status-codes';
import Vote from '../models/Vote.js';
import Candidate from '../models/Candidate.js';
import Users from '../models/Users.js';

export const castVote = async (req, res) => {
	try {
		const { votes } = req.body; // { position, candidateIds}
		const { studentId } = req.user;

		if (!votes || !Array.isArray(votes)) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: 'error',
				message: 'Invalid VOte format',
			});
		}

		const voter = await Users.findOne({ studentId });

		if (voter.hasVoted === true) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: 'error',
				message: 'You have voted already',
			});
		}

		for (const voteData of votes) {
			const { position, candidateIds } = voteData;

			if (position === 'Senate') {
				if (candidateIds.length > 3) {
					return res.status(StatusCodes.BAD_REQUEST).json({
						status: 'error',
						message: 'Maximum of 3 votes can be cast for senate',
					});
				}

				const senateCandidate = await Candidate.find({
					_id: { $in: candidateIds },
				}).populate('user');

				const hasInvalidLevel = senateCandidate.some(
					(candidate) => candidate.user.level != +voter.level
				);

				if (hasInvalidLevel) {
					return res.status(StatusCodes.FORBIDDEN).json({
						status: 'error',
						message:
							'Can only vote for senate candidates in your level',
					});
				}
			}

			for (const candidateId of candidateIds) {
				const candidate = await Candidate.findById(candidateId);

				if (!candidate || candidate.position !== position) {
					return res.status(StatusCodes.BAD_REQUEST).json({
						status: 'error',
						message: 'Invalid Position',
					});
				}

				const vote = new Vote({
					candidate: candidate._id,
					isVotedYes: true,
				});

				await vote.save();

				candidate.votesCount = (candidate.votesCount || 0) + 1;
				await candidate.save();
			}
			voter.votedPositions.push(position);
			voter.hasVoted = true;
			await voter.save();
		}

		res.status(StatusCodes.OK).json({
			status: 'success',
			message: 'Vote has been cast successfully',
			votedPositions: voter.votedPositions,
		});
	} catch (err) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 'error',
			message: err.message,
		});
	}
};

export const getResults = async (req, res) => {
	try {
		const results = await Vote.getResultsByPosition();

		res.status(StatusCodes.OK).json({
			status: 'success',
			results,
		});
	} catch (err) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 'error',
			message: err.message,
		});
	}
};
