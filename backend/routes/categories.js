import express from 'express';
import Category from '../models/Category.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/categories
router.post('/', protect, admin, async (req, res) => {
    const { name, description } = req.body;
    try {
        const category = await Category.create({ name, description });
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   DELETE /api/categories/:id
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (category) {
            res.json({ message: 'Kategori silindi' });
        } else {
            res.status(404).json({ message: 'Kategori bulunamadı' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
