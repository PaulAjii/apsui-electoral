import { StatusCodes } from 'http-status-codes';

export const isVoter = (req, res, next) => {
	if (req.user && req.user.role === 'voter') {
		next();
	} else {
		res.status(StatusCodes.FORBIDDEN).json({
			status: 'error',
			message: 'Access denied. Admin cannot vote.',
		});
	}
};
