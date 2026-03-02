import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            padding: '3rem 0',
            marginTop: '4rem',
            borderTop: '1px solid var(--border)',
            background: 'var(--card)'
        }}>
            <div className="container" style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>BEUBlog</h2>
                <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem' }}>
                    Modern, hızlı ve şık bir blog platformu.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
                    <a href="#" className="hover-link">Hakkımızda</a>
                    <a href="#" className="hover-link">Gizlilik Politikası</a>
                    <a href="#" className="hover-link">İletişim</a>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                    © {new Date().getFullYear()} BEUBlog. Tüm hakları saklıdır.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
