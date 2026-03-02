import express from 'express';
import Post from '../models/Post.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/posts
router.get('/', async (req, res) => {
    try {
        const { category, author, status, search } = req.query;
        let query = {};

        if (category) query.category = category;
        if (author) query.author = author;
        if (status === 'all' || status === '') {
            // No status filter
        } else if (status) {
            query.status = status;
        } else {
            query.status = 'published';
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { excerpt: { $regex: search, $options: 'i' } }
            ];
        }

        const posts = await Post.find(query)
            .populate('author', 'username avatar')
            .populate('category', 'name')
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/posts/by-slug/:slug
router.get('/by-slug/:slug', async (req, res) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug })
            .populate('author', 'username avatar bio')
            .populate('category', 'name');

        if (post) {
            post.views += 1;
            await post.save();
            res.json(post);
        } else {
            res.status(404).json({ message: 'Yazı bulunamadı' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/posts/:id
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username avatar')
            .populate('category', 'name');
        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ message: 'Yazı bulunamadı' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/posts
router.post('/', protect, async (req, res) => {
    const { title, content, excerpt, coverImage, category } = req.body;
    try {
        const post = await Post.create({
            title,
            content,
            excerpt,
            coverImage,
            category,
            author: req.user._id,
            status: req.user.role === 'admin' ? 'published' : 'pending'
        });
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   PUT /api/posts/:id
router.put('/:id', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Yazı bulunamadı' });

        if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bu işlemi yapmaya yetkiniz yok' });
        }

        post.title = req.body.title || post.title;
        post.content = req.body.content || post.content;
        post.excerpt = req.body.excerpt || post.excerpt;
        post.coverImage = req.body.coverImage || post.coverImage;
        post.category = req.body.category || post.category;

        const updatedPost = await post.save();
        res.json(updatedPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   DELETE /api/posts/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Yazı bulunamadı' });

        if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bu işlemi yapmaya yetkiniz yok' });
        }

        await post.deleteOne();
        res.json({ message: 'Yazı silindi' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/posts/:id/like
router.put('/:id/like', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Yazı bulunamadı' });

        const isLiked = post.likes.includes(req.user._id);
        if (isLiked) {
            post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
        } else {
            post.likes.push(req.user._id);
        }

        await post.save();
        res.json({ likes: post.likes.length, isLiked: !isLiked });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/posts/:id/status
router.put('/:id/status', protect, admin, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Yazı bulunamadı' });

        post.status = req.body.status || post.status;
        const updatedPost = await post.save();
        res.json(updatedPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
