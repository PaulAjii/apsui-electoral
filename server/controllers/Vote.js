import { StatusCodes } from 'http-status-codes';
import Vote from '../models/Vote.js';
import Candidate from '../models/Candidate.js';

export const castVote = async (req, res) => {
	try {
		const { alias, position, isVotedYes } = req.body;

		if (!alias || !position) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: 0,
				message: 'All fields are required',
			});
		}

		//    Validate User by auth token

		// Validate Candidate
		const candidate = await Candidate.findOne({ alias, position }).populate(
			'user'
		);

		if (!candidate) {
			return res.status(StatusCodes.NOT_FOUND).json({
				status: 0,
				message: 'Candidate can not be found',
			});
		}

		const vote = new Vote({
			candidate: candidate._id,
			isVotedYes,
		});

		await vote.save();

		if (isVotedYes) {
			candidate.votesCount = (candidate.votesCount || 0) + 1;
			await candidate.save();
		}

		res.status(StatusCodes.OK).json({
			status: 1,
			message: 'Vote has been cast successfully',
			candidate,
		});
	} catch (err) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 0,
			message: err.message,
		});
	}
};

export const getResults = async (req, res) => {
	try {
		const results = await Vote.getResultsByPosition();

		res.status(StatusCodes.OK).json({
			status: 1,
			results,
		});
	} catch (err) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 0,
			message: err.message,
		});
	}
};
