import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema(
	{
		candidate: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Candidate',
			required: true,
		},
		isVotedYes: {
			type: Boolean,
			required: true,
		},
		votedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true }
);

voteSchema.statics.getResultsByPosition = async function () {
	return this.aggregate([
		{
			$lookup: {
				from: 'candidates',
				localField: 'candidate',
				foreignField: '_id',
				as: 'candidate',
			},
		},
		{ $unwind: '$candidate' },
		{
			$group: {
				_id: {
					position: '$candidate.position',
					candidateID: '$candidate.alias',
					candidateName: '$candidate.name',
				},
				yesVotes: {
					$sum: { $cond: [{ $eq: ['$isVotedYes', true] }, 1, 0] },
				},
				noVotes: {
					$sum: { $cond: [{ $eq: ['$isVotedYes', false] }, 1, 0] },
				},
				totalVotes: { $sum: 1 },
			},
		},
		{
			$group: {
				_id: '$_id.position',
				candidates: {
					$push: {
						alias: '$_id.candidateID',
						name: '$_id.candidateName',
						yesVotes: '$yesVotes',
						noVotes: '$noVotes',
						totalVotes: '$totalVotes',
					},
				},
				positionTotalVotes: { $sum: '$totalVotes' },
			},
		},

		{ $sort: { _id: 1 } },
	]);
};

const Vote = mongoose.model('Vote', voteSchema);

export default Vote;
