import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Post from '../models/Post.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'gizli-key', {
        expiresIn: '30d'
    });
};

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ message: 'Kullanıcı adı veya e-posta zaten kullanımda' });
        }

        const user = await User.create({ username, email, password });
        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');
        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                bio: user.bio,
                avatar: user.avatar,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Geçersiz e-posta veya parola' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/auth/me
router.get('/me', protect, async (req, res) => {
    res.json(req.user);
});

// @route   PUT /api/auth/me/profile
router.put('/me/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.username = req.body.username || user.username;
            user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
            user.avatar = req.body.avatar || user.avatar;

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role,
                bio: updatedUser.bio,
                avatar: updatedUser.avatar
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/auth/me/password
router.put('/me/password', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('+password');
        const { currentPassword, newPassword } = req.body;

        if (user && (await user.comparePassword(currentPassword))) {
            user.password = newPassword;
            await user.save();
            res.json({ message: 'Parola başarıyla güncellendi' });
        } else {
            res.status(400).json({ message: 'Mevcut parola yanlış' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/auth/me/posts
router.get('/me/posts', protect, async (req, res) => {
    try {
        const posts = await Post.find({ author: req.user._id }).populate('category', 'name');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
