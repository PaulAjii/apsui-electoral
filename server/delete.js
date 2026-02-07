import Vote from "./models/Vote.js";
import Users from "./models/Users.js";
import connectDB from './config/conn.js';
import dotenv from 'dotenv';

dotenv.config();

const usersToDelete = ['248782', '243162', '243163', '235353', '235354', '229516', '229517', '220758', '220759', '248781', '248783'];

const deleteUsers = async () => {
    try {
        await connectDB(process.env.DB_URI);

        await Users.deleteMany({ studentId: { $in: usersToDelete } });
        await Users.updateMany({ role: { $ne: 'admin' } }, { $set: { hasVoted: false }});
        await Vote.deleteMany({});

        console.log('Specified users and all votes have been deleted successfully!');
        process.exit(0);
    } catch (err) {
        console.error(err?.message || err);
        process.exit(1);
    }
}

deleteUsers();