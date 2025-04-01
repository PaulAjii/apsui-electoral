import { StatusCodes } from 'http-status-codes';

export const isAdmin = (req, res, next) => {
	if (req.user && req.user.role === 'admin') {
		next();
	} else {
		res.status(StatusCodes.FORBIDDEN).json({
			status: 'error',
			message: 'Access denied. Admin rights required.',
		});
	}
};
