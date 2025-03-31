import { StatusCodes } from 'http-status-codes';
import User from '../models/Users.js';

export const resetPassword = async (req, res) => {
	try {
		const { studentId, newPassword } = req.body;

		const user = await User.findOne({ studentId });

		if (!user) {
			return res.status(StatusCodes.NOT_FOUND).json({
				status: 'error',
				message: 'User not found',
			});
		}

		user.password = newPassword;
		user.isFirstTimeLogin = false;
		await user.save();

		res.status(StatusCodes.OK).json({
			status: 'success',
			message: 'Passowrd updated successfuly',
		});
	} catch (err) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: 'error',
			message: err.message,
		});
	}
};
