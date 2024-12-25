import { StatusCodes } from 'http-status-codes';

import User from '../models/Users.js';

export const createUser = async (req, res) => {
	try {
		const { studentId, password, level } = req.body;

		if (!studentId || !password || !level) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: 0,
				message: 'All fields are required',
			});
		}

		const userInstance = new User({ ...req.body });
		const user = await userInstance.save();

		res.status(StatusCodes.CREATED).json({
			status: 1,
			user,
		});
	} catch (err) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 0,
			message: err.message,
		});
	}
};

export const getUsers = async (req, res) => {
	try {
		const users = await User.find();

		if (!users) {
			return res.status(StatusCodes.NOT_FOUND).json({
				status: 0,
				message: 'No users found',
			});
		}

		res.status(StatusCodes.OK).json({
			status: 1,
			no_of_users: users.length,
			users,
		});
	} catch (err) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 0,
			message: err.message,
		});
	}
};
