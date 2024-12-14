import Candidate, {
	GenderEnum,
	PositionsByLevel,
} from '../models/Candidate.js';
import User, { ContestLevelEnum } from '../models/Users.js';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/async_handler.js';

export const getAllCandidates = asyncHandler(async (req, res) => {
	try {
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
				? 'https://www.freepik.com/free-vector/man-red-shirt-with-white-collar_226744976.htm#fromView=search&page=1&position=36&uuid=ff053316-6eeb-432b-b5c2-0a5603c897a1'
				: 'https://www.freepik.com/free-vector/flat-style-woman-avatar_226744995.htm#fromView=search&page=1&position=44&uuid=ff053316-6eeb-432b-b5c2-0a5603c897a1';

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
