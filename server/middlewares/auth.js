import jwt from 'jsonwebtoken';
import { StatusCodes } from '../utils/statusCodes.js';

export const authenticateUser = async (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(StatusCodes.UNAUTHORIZED).json({
			status: 'error',
			message: 'Authentication invalid',
		});
	}

	const token = authHeader.split(' ')[1];

	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		req.user = payload;
		next();
	} catch (error) {
		res.status(StatusCodes.UNAUTHORIZED).json({
			status: 'error',
			message: 'Authentication invalid',
		});
	}
};
