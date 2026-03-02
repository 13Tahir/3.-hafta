import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { Edit, Trash2, Eye, User, Settings, PenTool, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, updateProfile } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('posts'); // posts, profile
    const [username, setUsername] = useState(user?.username || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [updating, setUpdating] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchUserPosts = async () => {
            try {
                const endpoint = user.role === 'admin' ? '/posts?status=' : '/auth/me/posts';
                const { data } = await api.get(endpoint);
                setPosts(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserPosts();
    }, [user, navigate]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setUpdating(true);
        const result = await updateProfile({ username, bio });
        if (result.success) {
            setMessage({ type: 'success', text: 'Profil güncellendi' });
        } else {
            setMessage({ type: 'error', text: result.message });
        }
        setUpdating(false);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleDeletePost = async (id) => {
        if (window.confirm('Bu yazıyı silmek istediğinize emin misiniz?')) {
            try {
                await api.delete(`/posts/${id}`);
                setPosts(posts.filter(p => p._id !== id));
            } catch (err) {
                alert('Yazı silinemedi');
            }
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}>Yükleniyor...</div>;

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                {/* Sidebar */}
                <aside style={{ width: '100%', maxWidth: '280px' }}>
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--muted)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                {user.avatar ? <img src={user.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={48} />}
                            </div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{user.username}</h2>
                            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>{user.email}</p>
                            <div style={{ marginTop: '0.5rem' }}>
                                <span style={{
                                    padding: '0.1rem 0.6rem',
                                    borderRadius: '1rem',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    fontSize: '0.7rem'
                                }}>
                                    {user.role.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <button
                                onClick={() => setActiveTab('posts')}
                                className={`btn ${activeTab === 'posts' ? 'btn-primary' : 'btn-outline'}`}
                                style={{ justifyContent: 'flex-start', border: 'none' }}
                            >
                                <LayoutDashboard size={18} /> Yazılarım
                            </button>
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-outline'}`}
                                style={{ justifyContent: 'flex-start', border: 'none' }}
                            >
                                <Settings size={18} /> Profil Ayarları
                            </button>
                        </nav>
                    </div>
                </aside>

                {/* Content */}
                <main style={{ flex: 1 }}>
                    {message.text && (
                        <div style={{
                            padding: '1rem',
                            borderRadius: 'var(--radius)',
                            marginBottom: '1rem',
                            background: message.type === 'success' ? '#dcfce7' : '#fef2f2',
                            color: message.type === 'success' ? '#15803d' : '#b91c1c'
                        }}>
                            {message.text}
                        </div>
                    )}

                    {activeTab === 'posts' ? (
                        <div className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Yazılarım</h3>
                                <Link to="/create-post" className="btn btn-primary"><PenTool size={18} /> Yeni Yazı</Link>
                            </div>

                            {posts.length === 0 ? (
                                <p style={{ color: 'var(--muted-foreground)', textAlign: 'center', padding: '2rem' }}>Henüz hiç yazı paylaşmamışsınız.</p>
                            ) : (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                                <th style={{ padding: '1rem' }}>Başlık</th>
                                                <th style={{ padding: '1rem' }}>Kategori</th>
                                                <th style={{ padding: '1rem' }}>Durum</th>
                                                <th style={{ padding: '1rem' }}>Tarih</th>
                                                <th style={{ padding: '1rem' }}>İşlemler</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {posts.map(post => (
                                                <tr key={post._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                                    <td style={{ padding: '1rem', fontWeight: 500 }}>{post.title}</td>
                                                    <td style={{ padding: '1rem' }}>{post.category?.name}</td>
                                                    <td style={{ padding: '1rem' }}>
                                                        <span style={{
                                                            padding: '0.2rem 0.5rem',
                                                            borderRadius: '0.5rem',
                                                            fontSize: '0.75rem',
                                                            background: post.status === 'published' ? '#dcfce7' : post.status === 'pending' ? '#fef9c3' : '#fee2e2',
                                                            color: post.status === 'published' ? '#15803d' : post.status === 'pending' ? '#a16207' : '#b91c1c'
                                                        }}>
                                                            {post.status === 'published' ? 'Yayında' : post.status === 'pending' ? 'Bekliyor' : 'Askıda'}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{new Date(post.createdAt).toLocaleDateString()}</td>
                                                    <td style={{ padding: '1rem' }}>
                                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                            <Link to={`/post/${post.slug}`} className="btn btn-outline" style={{ padding: '0.4rem' }}><Eye size={16} /></Link>
                                                            <Link to={`/edit-post/${post._id}`} className="btn btn-outline" style={{ padding: '0.4rem' }}><Edit size={16} /></Link>
                                                            <button onClick={() => handleDeletePost(post._id)} className="btn btn-outline" style={{ padding: '0.4rem', color: '#ef4444' }}><Trash2 size={16} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="card">
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Profil Ayarları</h3>
                            <form onSubmit={handleUpdateProfile}>
                                <div className="input-group">
                                    <label>Kullanıcı Adı</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Biyografi</label>
                                    <textarea
                                        className="input-field"
                                        rows="4"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={updating}>
                                    {updating ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
                                </button>
                            </form>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
