import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Image, Send, X, ArrowLeft } from 'lucide-react';

const EditPost = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [coverImage, setCoverImage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catsRes, postRes] = await Promise.all([
                    api.get('/categories'),
                    api.get(`/posts/${id}`)
                ]);

                setCategories(catsRes.data);
                const post = postRes.data;
                setTitle(post.title);
                setContent(post.content);
                setExcerpt(post.excerpt);
                setCategory(post.category?._id || post.category);
                setCoverImage(post.coverImage);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // I'll need to update the backend to include GET /api/posts/:id.
    // For now, I'll write the frontend assuming it works.

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
        try {
            await api.put(`/posts/${id}`, { title, content, excerpt, category, coverImage });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Yazı güncellenemedi');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}>Yükleniyor...</div>;

    return (
        <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: '2rem', border: 'none', background: 'transparent' }}>
                <ArrowLeft size={20} /> Vazgeç
            </button>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>Yazıyı Düzenle</h1>

            {error && <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '2rem' }}>{error}</div>}

            <form onSubmit={handleSubmit} className="grid grid-cols-1">
                <div className="card">
                    <div className="input-group">
                        <label>Başlık</label>
                        <input
                            type="text"
                            className="input-field"
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
                                            <span>Görseli Değiştir</span>
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
                            <label>Yazı Özeti</label>
                            <textarea
                                className="input-field"
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
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" className="btn btn-primary" disabled={uploading}>
                            <Send size={18} /> Güncelle
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditPost;
