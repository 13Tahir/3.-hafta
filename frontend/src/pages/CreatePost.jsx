import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Image, Send, X } from 'lucide-react';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [coverImage, setCoverImage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/categories');
                setCategories(data);
                if (data.length > 0) setCategory(data[0]._id);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCategories();
    }, []);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const { data } = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setCoverImage(`http://localhost:5000${data.url}`);
        } catch (err) {
            setError('Görsel yüklenemedi');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !content || !excerpt || !category) {
            setError('Lütfen tüm alanları doldurun');
            return;
        }

        try {
            await api.post('/posts', { title, content, excerpt, category, coverImage });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Yazı paylaşılamadı');
        }
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>Yeni Yazı Oluştur</h1>

            {error && <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '2rem' }}>{error}</div>}

            <form onSubmit={handleSubmit} className="grid grid-cols-1">
                <div className="card">
                    <div className="input-group">
                        <label>Başlık</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Yazı başlığını girin..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Kapak Görseli</label>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                                <input
                                    type="file"
                                    id="cover-upload"
                                    hidden
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                />
                                <label htmlFor="cover-upload" className="btn btn-outline" style={{ cursor: 'pointer', width: '100%', height: '150px', display: 'flex', flexDirection: 'column', border: '2px dashed var(--border)' }}>
                                    {uploading ? 'Yükleniyor...' : (
                                        <>
                                            <Image size={32} />
                                            <span>Görsel Yüklemek İçin Tıklayın</span>
                                        </>
                                    )}
                                </label>
                            </div>
                            {coverImage && (
                                <div style={{ position: 'relative' }}>
                                    <img src={coverImage} style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: 'var(--radius)' }} />
                                    <button onClick={() => setCoverImage('')} style={{ position: 'absolute', top: -10, right: -10, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer' }}>
                                        <X size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2">
                        <div className="input-group">
                            <label>Kategori</label>
                            <select
                                className="input-field"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            >
                                <option value="">Seçin...</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Yazı Özeti (Listeleme için)</label>
                            <textarea
                                className="input-field"
                                placeholder="Kısa bir özet..."
                                rows="1"
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>İçerik</label>
                        <div style={{ background: 'var(--input)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                            <ReactQuill
                                theme="snow"
                                value={content}
                                onChange={setContent}
                                modules={modules}
                                placeholder="Hikayenizi anlatın..."
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" onClick={() => navigate(-1)} className="btn btn-outline">İptal</button>
                        <button type="submit" className="btn btn-primary" disabled={uploading}>
                            <Send size={18} /> Paylaş
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
