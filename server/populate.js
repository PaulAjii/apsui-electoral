import bcrypt from 'bcrypt';
import Users from './models/Users.js';
import connectDB from './config/conn.js';
import dotenv from 'dotenv';
import capitalize from './utils/capitalize.js';
import data from './db/data.json' with { type: 'json' };
import Candidates from './models/Candidate.js';

dotenv.config();

const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(password, salt);
};

const populateDB = async () => {
	try {
		await connectDB(process.env.DB_URI);

		const uniqueUsersMap = new Map(data.map(user => [user.studentId, user]));
		const uniqueUsers = Array.from(uniqueUsersMap.values());

		console.log(`Processing ${uniqueUsers.length} unique users...`);

		const transformedUserData = await Promise.all(
			uniqueUsers.map(async (user) => ({
				studentId: user.studentId,
				name: `${capitalize(user.firstName)} ${capitalize(user.lastName)}`,
				password: await hashPassword(user.studentId),
				level: user.level,
				set: user.set,
				role: user.role || 'voter'
			}))
		);

		await Users.deleteMany({});
		await Candidates.deleteMany({});

		try {
			await Users.insertMany(transformedUserData, { ordered: false });
			console.log('Database populated successfully!');
		} catch (insertError) {
			console.log(`Finished with some errors: ${insertError.insertedDocs.length} documents inserted.`);
		}

		process.exit(0);
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

populateDB();
