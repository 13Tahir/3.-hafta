import mongoose from 'mongoose';
import slugify from 'slugify';

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Başlık zorunludur'],
        trim: true
    },
    slug: {
        type: String,
        unique: true
    },
    content: {
        type: String,
        required: [true, 'İçerik zorunludur']
    },
    excerpt: {
        type: String,
        required: [true, 'Kısa açıklama zorunludur']
    },
    coverImage: {
        type: String,
        default: ''
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['pending', 'published', 'suspended'],
        default: 'pending'
    },
    views: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

postSchema.pre('save', function (next) {
    if (!this.isModified('title')) return next();
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Math.random().toString(36).substring(2, 7);
    next();
});

const Post = mongoose.model('Post', postSchema);
export default Post;
