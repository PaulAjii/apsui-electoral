import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import User from '../models/Users.js';

export const login = async (req, res) => {
	try {
		const { studentId, password } = req.body;

		if (!studentId || !password) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: 'error',
				message: 'All fields are required',
			});
		}

		const user = await User.findOne({ studentId });
		if (!user) {
			return res.status(StatusCodes.NOT_FOUND).json({
				status: 'error',
				message: 'User not found',
			});
		}

		const isPasswordMatch = await user
			.comparePassword(password)
			.select('-password');

		if (!isPasswordMatch) {
			return res.status(StatusCodes.UNAUTHORIZED).json({
				status: 'error',
				message: 'Invalid Credentials',
			});
		}

		const token = jwt.sign(
			{
				id: user._id,
				studentId: user.studentId,
				role: user.role,
				level: user.level,
			},
			process.env.JWT_SECRET,
			{ expiresIn: process.env.JWT_LIFETIME }
		);

		res.status(StatusCodes.OK).json({
			status: 'success',
			user,
			token,
		});
	} catch (err) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 'error',
			message: err.message,
		});
	}
};
