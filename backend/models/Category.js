import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Kategori adı zorunludur'],
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true
    },
    description: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

categorySchema.pre('save', function (next) {
    if (!this.isModified('name')) return next();
    this.slug = slugify(this.name, { lower: true, strict: true });
    next();
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
