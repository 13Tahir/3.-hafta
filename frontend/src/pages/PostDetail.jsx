import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Calendar, User, Heart, Share2, ArrowLeft, MessageSquare, Eye } from 'lucide-react';

const PostDetail = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data } = await api.get(`/posts/by-slug/${slug}`);
                setPost(data);
                setLikesCount(data.likes.length);
                if (user && data.likes.includes(user._id)) {
                    setLiked(true);
                }
            } catch (error) {
                console.error('Yazı yüklenemedi', error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [slug, user, navigate]);

    const handleLike = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            const { data } = await api.put(`/posts/${post._id}/like`);
            setLiked(data.isLiked);
            setLikesCount(data.likes);
        } catch (error) {
            console.error('Beğeni hatası', error);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}>Yükleniyor...</div>;
    if (!post) return <div style={{ textAlign: 'center', padding: '5rem' }}>Yazı bulunamadı.</div>;

    return (
        <article className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: '2rem', border: 'none', background: 'transparent' }}>
                <ArrowLeft size={20} /> Geri Dön
            </button>

            <header style={{ marginBottom: '3rem' }}>
                <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    background: 'var(--muted)',
                    color: 'var(--primary)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    marginBottom: '1rem',
                    display: 'inline-block'
                }}>
                    {post.category?.name}
                </span>
                <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1.5rem' }}>{post.title}</h1>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            {post.author.avatar ? <img src={post.author.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={24} />}
                        </div>
                        <div>
                            <p style={{ fontWeight: 600 }}>{post.author.username}</p>
                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
                                <span>{new Date(post.createdAt).toLocaleDateString('tr-TR')}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Eye size={14} /> {post.views}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={handleLike}
                            className="btn btn-outline"
                            style={{ color: liked ? '#ef4444' : 'inherit', borderColor: liked ? '#ef4444' : 'var(--border)' }}
                        >
                            <Heart size={20} fill={liked ? '#ef4444' : 'none'} /> {likesCount}
                        </button>
                        <button className="btn btn-outline"><Share2 size={20} /></button>
                    </div>
                </div>
            </header>

            {post.coverImage && (
                <img
                    src={post.coverImage}
                    alt={post.title}
                    style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: 'var(--radius)', marginBottom: '3rem' }}
                />
            )}

            <div
                className="post-content"
                style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--card-foreground)' }}
                dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <section style={{ marginTop: '4rem', padding: '2rem', background: 'var(--muted)', borderRadius: 'var(--radius)' }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                        {post.author.avatar ? <img src={post.author.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={40} />}
                    </div>
                    <div>
                        <h3 style={{ marginBottom: '0.5rem' }}>{post.author.username} Hakkında</h3>
                        <p style={{ color: 'var(--muted-foreground)' }}>{post.author.bio || 'Bu yazar henüz bir biyografi eklememiş.'}</p>
                    </div>
                </div>
            </section>
        </article>
    );
};

export default PostDetail;
