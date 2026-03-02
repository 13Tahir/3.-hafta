import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Post from './models/Post.js';
import slugify from 'slugify';

dotenv.config();

const migrateSlugs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const posts = await Post.find({ slug: { $exists: false } });

        console.log(`${posts.length} yazı güncellenecek...`);

        for (const post of posts) {
            post.slug = slugify(post.title, { lower: true, strict: true }) + '-' + Math.random().toString(36).substring(2, 7);
            await post.save();
        }

        console.log('Migrasyon tamamlandı.');
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

migrateSlugs();
