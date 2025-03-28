import { StatusCodes } from 'http-status-codes';

import User from '../models/Users.js';

export const createUser = async (req, res) => {
	try {
		const { studentId, role, level } = req.body;

		if (!studentId || !level) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				status: 'error',
				message: 'All fields are required',
			});
		}

		const userInstance = new User({
			...req.body,
			role,
			password: studentId,
		});
		const user = await userInstance.save();

		res.status(StatusCodes.CREATED).json({
			status: 'success',
			user,
		});
	} catch (err) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 'error',
			message: err.message,
		});
	}
};

export const getUsers = async (req, res) => {
	try {
		const users = await User.find();

		if (!users) {
			return res.status(StatusCodes.NOT_FOUND).json({
				status: 'error',
				message: 'No users found',
			});
		}

		res.status(StatusCodes.OK).json({
			status: 'success',
			no_of_users: users.length,
			users,
		});
	} catch (err) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 'error',
			message: err.message,
		});
	}
};

export const getUser = async (req, res) => {
	try {
		const { id } = req.params;

		const user = await User.findById(id).select('-password');

		if (!user) {
			return res.status(StatusCodes.NOT_FOUND).json({
				status: 'error',
				message: 'User not found',
			});
		}

		res.status(StatusCodes.OK).json({
			status: 'success',
			user,
		});
	} catch (err) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 'error',
			message: err.message,
		});
	}
};

export const updateUser = async (req, res) => {
	try {
		const { id } = req.params;

		const userToUpdate = await User.findById(id);

		if (!userToUpdate) {
			return res.status(StatusCodes.NOT_FOUND).json({
				status: 'error',
				message: 'User not found',
			});
		}

		const { name, level } = req.body;

		const user = await User.findByIdAndUpdate(
			id,
			{ name, level },
			{ new: true }
		);

		if (!user) {
			return res.status(StatusCodes.NOT_FOUND).json({
				status: 'error',
				message: 'Voter not found',
			});
		}

		res.status(StatusCodes.OK).json({
			status: 'success',
			user,
		});
	} catch (err) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 'error',
			message: err.message,
		});
	}
};
