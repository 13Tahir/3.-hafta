import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const makeAdmin = async () => {
    const username = process.argv[2];

    if (!username) {
        console.log('Lütfen bir kullanıcı adı girin: node make-admin.js <username>');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const user = await User.findOne({ username });

        if (!user) {
            console.log('Kullanıcı bulunamadı');
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();

        console.log(`${username} artık bir admin.`);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

makeAdmin();
