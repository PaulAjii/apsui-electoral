import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

dotenv.config();

import connectDB from './config/conn.js';
import candidateRouter from './router/Candidate.js';
import userRouter from './router/Users.js';
import voteRouter from './router/Vote.js';

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.status(200).send('Hello, World!');
});

app.use('/api/v1', candidateRouter);
app.use('/api/v1', userRouter);
app.use('/api/v1', voteRouter);
const startServer = async () => {
	try {
		await connectDB(process.env.DB_URI);
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT} successfully!`);
		});
	} catch (err) {
		console.error(err);
	}
};

startServer();
