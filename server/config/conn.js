import mongoose from 'mongoose';

const connectDB = async (url) => {
	try {
		await mongoose.connect(url);
		console.log('Database successfully connected!');
	} catch (err) {
		console.log(err);
	}
};

export default connectDB;
