import mongoose from 'mongoose';
import { ContestLevelEnum } from './Users.js';

export const GenderEnum = {
	MALE: 'Male',
	FEMALE: 'Female',
};

export const PositionsByLevel = {
	[ContestLevelEnum['100']]: ['Special Duties Officer'],
	[ContestLevelEnum['200']]: [
		'Treasurer',
		'Financial Secretary',
		'Social Director',
		'Sports Secretary',
		'Assistant General Secretary',
	],
	[ContestLevelEnum['300']]: ['Vice President', 'General Secretary'],
	[ContestLevelEnum['400']]: ['President'],
};

const candidateSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},

		name: {
			type: String,
			required: true,
		},

		alias: {
			type: String,
			default: function () {
				return this.name.split(' ')[0];
			},
		},

		position: {
			type: String,
			required: true,
			validate: {
				validator: async function (position) {
					const userDoc = await this.model('User').findById(
						this.user
					);
					if (!userDoc) return false;

					return PositionsByLevel[userDoc.level]?.includes(position);
				},
				message: (props) =>
					`${props.value} is not a valid position for this level`,
			},
		},

		gender: {
			type: String,
			enum: Object.values(GenderEnum),
			required: true,
		},

		imageURL: {
			type: String,
		},

		catchPhrase: {
			type: String,
			default: 'Another Level!',
		},

		votesCount: {
			type: Number,
			default: 0,
		},

		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

const Candidate = mongoose.model('Candidate', candidateSchema);

export default Candidate;
