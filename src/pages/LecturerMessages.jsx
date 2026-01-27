import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Trash2, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LecturerMessages = () => {
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, [token]);

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/contact', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this message?')) return;
        try {
            const res = await fetch(`/api/contact/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchMessages();
            }
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <div style={{ background: '#f8f9fa', minHeight: '100vh', color: '#1a1a1a', paddingBottom: '6rem' }}>
            <nav style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 100 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Link to="/academy/lecturer" style={{ color: '#000', textDecoration: 'none', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ArrowLeft size={18} /> <span>Back to Dashboard</span>
                    </Link>
                </div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Inquiries</h1>
                <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#000', opacity: 0.6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.85rem' }}>
                    Logout <LogOut size={18} />
                </button>
            </nav>

            <div style={{ maxWidth: '1200px', padding: '4rem 1rem', margin: '0 auto' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>Loading inquiries...</div>
                ) : messages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '30px', boxShadow: '0 20px 50px rgba(0,0,0,0.03)' }}>
                        <Mail size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                        <p style={{ opacity: 0.5, fontWeight: 700 }}>No inquiries yet.</p>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }} className="messages-grid">
                        {messages.map((msg, index) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                style={{
                                    background: '#fff',
                                    padding: '2.5rem',
                                    borderRadius: '30px',
                                    boxShadow: '0 20px 50px rgba(0,0,0,0.03)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1.5rem'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>{msg.name}</h3>
                                            <span style={{
                                                fontSize: '0.65rem',
                                                fontWeight: 800,
                                                padding: '0.2rem 0.6rem',
                                                borderRadius: '50px',
                                                background: msg.source === 'SOAR' ? 'var(--color-soar)' :
                                                    msg.source === 'RESTORE' ? 'var(--color-restore)' :
                                                        msg.source === 'ROAR' ? 'var(--color-roar)' : '#666',
                                                color: 'white',
                                                textTransform: 'uppercase'
                                            }}>
                                                {msg.source || 'General'}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.75rem', opacity: 0.5, fontWeight: 700 }}>{new Date(msg.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(msg.id)}
                                        style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', border: 'none', borderRadius: '15px', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <p style={{ fontSize: '0.95rem', color: '#444', lineHeight: 1.7, flex: 1 }}>{msg.message}</p>

                                <div style={{ paddingTop: '1.5rem', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <a href={`mailto:${msg.email}`} style={{ color: msg.source === 'SOAR' ? 'var(--color-soar)' : msg.source === 'RESTORE' ? 'var(--color-restore)' : msg.source === 'ROAR' ? 'var(--color-roar)' : 'var(--color-soar)', fontWeight: 800, textDecoration: 'none', fontSize: '0.9rem' }}>
                                        {msg.email}
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 768px) {
                    nav { padding: 1rem !important; flex-direction: column; gap: 1rem; }
                    .messages-grid { grid-template-columns: 1fr !important; }
                    .logout-btn-text { display: none; }
                }
                @media (max-width: 480px) {
                    h1 { font-size: 1.1rem !important; }
                    nav a { font-size: 0.8rem !important; }
                }
            `}} />
        </div>
    );
};

export default LecturerMessages;
