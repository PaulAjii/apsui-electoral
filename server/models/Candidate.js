import mongoose from 'mongoose';
import { ContestLevelEnum } from './Users.js';

export const GenderEnum = {
	MALE: 'Male',
	FEMALE: 'Female',
};

export const PositionsByLevel = {
	[ContestLevelEnum['100']]: ['Special Duties Officer', 'Senate'],
	[ContestLevelEnum['200']]: [
		'Sports Secretary',
		'Social Director',
		'Special Duties Officer',
		'Public Relations Officer',
		'Assistant General Secretary',
		'Senate',
	],
	[ContestLevelEnum['300']]: [
		'Vice President',
		'General Secretary',
		'Assistant General Secretary',
		'Financial Secretary',
		'Treasurer',
		'Public Relations Officer',
		'Social Director',
		'Sports Secretary',
		'Senate',
	],
	[ContestLevelEnum['400']]: [
		'President',
		'Vice President',
		'General Secretary',
		'Assistant General Secretary',
		'Financial Secretary',
		'Treasurer',
		'Public Relations Officer',
		'Sports Secretary',
		'Senate',
	],
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
			default: 'None',
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
