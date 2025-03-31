import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export const LevelEnum = {
	LEVEL_100: '100',
	LEVEL_200: '200',
	LEVEL_300: '300',
	LEVEL_400: '400',
	LEVEL_500: '500', // Can vote but can't contest
};

export const ContestLevelEnum = {
	[LevelEnum.LEVEL_100]: '100',
	[LevelEnum.LEVEL_200]: '200',
	[LevelEnum.LEVEL_300]: '300',
	[LevelEnum.LEVEL_400]: '400',
};

export const RoleEnum = {
	VOTER: 'voter',
	ADMIN: 'admin',
};

const userSchema = new mongoose.Schema(
	{
		studentId: {
			type: String,
			required: true,
			unique: true,
		},
		name: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: Object.values(RoleEnum),
			default: RoleEnum.VOTER,
		},
		level: {
			type: String,
			enum: Object.values(LevelEnum),
			required: function () {
				return this.role === RoleEnum.VOTER;
			},
		},
		set: {
			type: String,
			required: true,
		},
		votedPositions: {
			type: [String],
			default: function () {
				return this.role === RoleEnum.VOTER ? [] : undefined;
			},
			get: function (value) {
				return this.role === RoleEnum.VOTER ? value : undefined;
			},
		},
		hasVoted: {
			type: Boolean,
			default: function () {
				return this.role === RoleEnum.VOTER ? false : undefined;
			},
			get: function (value) {
				return this.role === RoleEnum.VOTER ? value : undefined;
			},
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		isFirstTimeLogin: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (err) {
		next(err);
	}
});

// Method to check if user can vote
userSchema.methods.canVote = function () {
	return this.role === RoleEnum.VOTER && !this.hasVoted;
};

// Method to check if user can contest
userSchema.methods.canContest = function () {
	return ContestLevelEnum[this.level].includes(this.level);
};

// Method to check if user is admin
userSchema.methods.isAdmin = function () {
	return this.role === RoleEnum.ADMIN;
};

export default mongoose.model('User', userSchema);
