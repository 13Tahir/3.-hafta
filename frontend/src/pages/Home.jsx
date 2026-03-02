import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Calendar, User, ChevronRight, Clock } from 'lucide-react';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const query = activeCategory ? `?category=${activeCategory}` : '';
                const { data } = await api.get(`/posts${query}`);
                setPosts(data);
            } catch (error) {
                console.error('Yazılar yüklenemedi', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/categories');
                setCategories(data);
            } catch (error) {
                console.error('Kategoriler yüklenemedi', error);
            }
        };

        fetchPosts();
        fetchCategories();
    }, [activeCategory]);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
            <div className="spinner">Yükleniyor...</div>
        </div>
    );

    return (
        <div className="animate-fade-in">
            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>
                    Dünyayı <span style={{ color: 'var(--primary)' }}>Keşfedin</span>
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--muted-foreground)', maxWidth: '600px', margin: '0 auto' }}>
                    En yeni teknoloji, tasarım ve yaşam tarzı içeriklerini burada bulabilirsiniz.
                </p>
            </header>

            {/* Categories Filter */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                    onClick={() => setActiveCategory(null)}
                    className={`btn ${!activeCategory ? 'btn-primary' : 'btn-outline'}`}
                    style={{ borderRadius: '2rem' }}
                >
                    Tümü
                </button>
                {categories.map(cat => (
                    <button
                        key={cat._id}
                        onClick={() => setActiveCategory(cat._id)}
                        className={`btn ${activeCategory === cat._id ? 'btn-primary' : 'btn-outline'}`}
                        style={{ borderRadius: '2rem' }}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {posts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--card)', borderRadius: 'var(--radius)' }}>
                    <p style={{ color: 'var(--muted-foreground)' }}>Henüz yazı paylaşılmamış.</p>
                </div>
            ) : (
                <div className="grid grid-cols-3">
                    {posts.map(post => (
                        <article key={post._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ position: 'relative', marginBottom: '1rem', overflow: 'hidden', borderRadius: 'calc(var(--radius) - 0.5rem)', height: '200px' }}>
                                <img
                                    src={post.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800'}
                                    alt={post.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '1rem',
                                        background: 'var(--primary)',
                                        color: 'white',
                                        fontSize: '0.75rem',
                                        fontWeight: 600
                                    }}>
                                        {post.category?.name}
                                    </span>
                                </div>
                            </div>

                            <div style={{ flex: 1 }}>
                                <Link to={`/post/${post.slug}`}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', cursor: 'pointer' }}>
                                        {post.title}
                                    </h3>
                                </Link>
                                <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {post.excerpt}
                                </p>
                            </div>

                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                        {post.author.avatar ? <img src={post.author.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={14} />}
                                    </div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{post.author.username}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--muted-foreground)', fontSize: '0.8rem' }}>
                                    <Clock size={14} />
                                    <span>{new Date(post.createdAt).toLocaleDateString('tr-TR')}</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
