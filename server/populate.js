import axios from 'axios';
import Users from './models/Users.js';
import connectDB from './config/conn.js';
import dotenv from 'dotenv';
import capitalize from './utils/capitalize.js';
dotenv.config();

const populateDB = async () => {
	try {
		await connectDB(process.env.DB_URI);

		// Fetch Data
		const { data } = await axios.get(process.env.API_ENDPOINT);
		const users = data.data;

		const transformedUserData = users.map((user) => ({
			studentId: user.matricNumber,
			name: `${capitalize(user.firstName)} ${capitalize(user.lastName)}`,
			password: user.matricNumber,
			level: user.level,
			set: user.classSet,
		}));

		await Users.deleteMany({});

		await Users.insertMany(transformedUserData);

		console.log('DataBase populated successfully!');
		process.exit(0);
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

populateDB();
