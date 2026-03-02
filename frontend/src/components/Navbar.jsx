import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut, User, PenTool, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass sticky-nav" style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            padding: '1rem 0',
            marginBottom: '2rem'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    BEUBlog
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button onClick={toggleTheme} className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>

                    {user ? (
                        <>
                            <Link to="/create-post" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                                <PenTool size={18} />
                                <span className="hide-mobile">Yazı Yaz</span>
                            </Link>
                            <div className="nav-user-dropdown" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.username} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <User size={18} />
                                        </div>
                                    )}
                                    <span className="hide-mobile">{user.username}</span>
                                </Link>
                                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem', color: '#ef4444' }}>
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Link to="/login" className="btn btn-outline">Giriş Yap</Link>
                            <Link to="/register" className="btn btn-primary">Kayıt Ol</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
