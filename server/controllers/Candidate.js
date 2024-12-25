import Candidate, {
	GenderEnum,
	PositionsByLevel,
} from '../models/Candidate.js';
import User, { ContestLevelEnum } from '../models/Users.js';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/async_handler.js';

export const getAllCandidates = asyncHandler(async (req, res) => {
	try {
		console.log('This is accessed');
		const candidates = await Candidate.find()
			.populate('user')
			.orFail()
			.exec();

		if (!candidates) {
			return res.status(StatusCodes.NOT_FOUND).json({
				status: 0,
				message: 'No candidate found!',
			});
		}
		res.status(StatusCodes.OK).json({
			status: 1,
			no_of_candidates: candidates.length,
			candidates,
		});
	} catch (err) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 0,
			message: err.message,
		});
	}
});

export const getSingleCandidate = asyncHandler(async (req, res) => {
	const { id } = req.params;

	try {
		const candidate = await Candidate.findById(id)
			.populate('user')
			.orFail()
			.exec();

		if (!candidate) {
			return res.status;
		}

		res.status(StatusCodes.OK).json({
			status: 1,
			candidate,
		});
	} catch (err) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 0,
			message: err.message,
		});
	}
});

export const createCandidate = asyncHandler(async (req, res) => {
	try {
		const { studentId, name, level, position, gender } = req.body;
		let imageURL = req.body.imageURL;

		if (!studentId || !name || !level || !position || !gender) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: 0,
				message:
					'Student_ID, Name, Position, and Gender fields are required',
			});
		}

		// Validate User
		const user = await User.findOne({ studentId });

		if (!user) {
			return res.status(StatusCodes.NOT_FOUND).json({
				status: 0,
				message: 'User not found',
			});
		}

		// Validate can Contest
		if (!user.canContest()) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: 0,
				message: 'User cannot contest',
			});
		}

		// Validate Level
		if (
			!ContestLevelEnum[level] ||
			ContestLevelEnum[level] !== user.level
		) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: 0,
				message: `Level does not match`,
			});
		}

		// Validate Position
		if (!PositionsByLevel[level]?.includes(position)) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: 0,
				message: `Position must be one of ${PositionsByLevel[
					level
				].join(', ')}`,
			});
		}

		// Validate Gender
		if (!Object.values(GenderEnum).includes(gender)) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: 0,
				message: `Gender must be one of: ${Object.values(
					GenderEnum
				).join(', ')}`,
			});
		}

		imageURL =
			gender === GenderEnum.MALE
				? 'https://img.freepik.com/free-vector/man-red-shirt-with-white-collar_90220-2873.jpg?t=st=1734931038~exp=1734934638~hmac=ee7f3a65ff99caff838f2d456f6da5b189ba275e653399dc89dc37f7a1bc0a31&w=826'
				: 'https://img.freepik.com/free-vector/flat-style-woman-avatar_90220-2876.jpg?t=st=1734931428~exp=1734935028~hmac=9c00700cba2b3f69fab54446bc7de2417057ee4e5a3202f81e4304bb8150153d&w=826';

		const candidateInstance = new Candidate({
			...req.body,
			imageURL,
			level: user.level,
			position,
			user: user._id,
		});
		const candidate = await candidateInstance.save();
		res.status(StatusCodes.CREATED).json({
			status: 1,
			candidate,
		});
	} catch (err) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 0,
			message: err.message,
		});
	}
});
