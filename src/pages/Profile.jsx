import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Heart, Calendar, CreditCard, ChevronRight,
    LogOut, Package, Book, ExternalLink, ShieldCheck,
    Clock, RefreshCcw, Layout, MessageSquare
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/1000665431.png';

const Profile = () => {
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();
    const [registrations, setRegistrations] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfileData();
    }, [token]);

    const fetchProfileData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/restore/my-registrations', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setRegistrations(data);

            // Also check for academy sync if they are a student
            if (user?.role === 'STUDENT' || user?.role === 'LECTURER') {
                const academyRes = await fetch('/api/academy', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const academyData = await academyRes.json();
                setPurchases(academyData.courses || []);
            }
        } catch (err) {
            console.error("Failed to fetch profile data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                <RefreshCcw size={32} color="var(--color-restore)" />
            </motion.div>
        </div>
    );

    const cardStyle = {
        background: '#fff',
        padding: '2.5rem',
        borderRadius: '35px',
        border: '1px solid rgba(0,0,0,0.05)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
        transition: 'all 0.3s ease'
    };

    const badgeStyle = (status) => ({
        padding: '0.5rem 1rem',
        borderRadius: '50px',
        fontSize: '0.7rem',
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '1px',
        background:
            status === 'scheduled' ? 'rgba(16, 185, 129, 0.1)' :
                status === 'pending' ? 'rgba(239, 68, 68, 0.1)' :
                    status === 'completed' ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.1)',
        color:
            status === 'scheduled' ? '#10b981' :
                status === 'pending' ? '#ef4444' :
                    status === 'completed' ? '#000' : '#666'
    });

    return (
        <div style={{ background: '#fcfcfc', minHeight: '100vh', color: '#1a1a1a' }}>
            {/* Nav */}
            <nav style={{ padding: '1.25rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Link to="/"><img src={logo} alt="RYZNO" style={{ height: '35px' }} /></Link>
                    <div style={{ width: '1px', height: '24px', background: 'rgba(0,0,0,0.1)' }}></div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--color-restore)', textTransform: 'uppercase', letterSpacing: '1px' }}>Profile Dashboard</span>
                </div>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, fontSize: '0.9rem' }}>
                        <div style={{ width: '35px', height: '35px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-restore)' }}>
                            <User size={18} />
                        </div>
                        {user?.username}
                    </div>
                    <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5 }}><LogOut size={22} /></button>
                </div>
            </nav>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 2rem' }}>
                {/* Hero */}
                <header style={{ marginBottom: '5rem' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-2px', marginBottom: '1rem' }}>Peace of Mind, {user?.fullName?.split(' ')[0]}</h1>
                    <p style={{ fontSize: '1.15rem', color: '#666', fontWeight: 500 }}>Track your sessions, download resources, and manage your journey.</p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem' }} className="profile-grid">
                    <main style={{ display: 'grid', gap: '3rem' }}>
                        {/* Restore Sessions */}
                        <section>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                                <Heart size={28} color="var(--color-restore)" />
                                <h3 style={{ fontSize: '1.75rem', fontWeight: 900 }}>Restore Sessions</h3>
                            </div>

                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                {registrations.length > 0 ? registrations.map(reg => (
                                    <motion.div key={reg.id} whileHover={{ x: 10 }} style={cardStyle}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                            <div>
                                                <span style={badgeStyle(reg.status)}>{reg.status}</span>
                                                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '1rem' }}>{reg.requestedDuration}hr Consultation</h4>
                                            </div>
                                            <div style={{ textAlign: 'right', color: '#999', fontSize: '0.8rem', fontWeight: 700 }}>
                                                ID: {reg.id.slice(0, 8)}
                                            </div>
                                        </div>

                                        {reg.assignments && reg.assignments.length > 0 && (
                                            <div style={{ display: 'grid', gap: '1rem', background: '#fcfcfc', padding: '1.5rem', borderRadius: '20px', marginBottom: '1.5rem' }}>
                                                {reg.assignments.map((a, i) => (
                                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.9rem', fontWeight: 700 }}>
                                                        <Calendar size={16} color="var(--color-restore)" />
                                                        {new Date(a.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} at {a.startTime}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#666', fontSize: '0.9rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                                                <Clock size={16} /> Booked {new Date(reg.createdAt).toLocaleDateString()}
                                            </span>
                                            <Link to={`/restore/details/${reg.id}`} style={{ color: '#000', fontWeight: 800, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                View Report <ChevronRight size={18} />
                                            </Link>
                                        </div>
                                    </motion.div>
                                )) : (
                                    <div style={{ ...cardStyle, textAlign: 'center', padding: '4rem' }}>
                                        <p style={{ color: '#999', fontWeight: 600 }}>No active sessions found.</p>
                                        <Link to="/restore/register" style={{ display: 'inline-block', marginTop: '1.5rem', padding: '1rem 2.5rem', background: 'var(--color-restore)', color: '#fff', borderRadius: '50px', textDecoration: 'none', fontWeight: 900 }}>Book a Session</Link>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Academy Integration */}
                        {purchases.length > 0 && (
                            <section>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                                    <Book size={28} color="var(--color-soar)" />
                                    <h3 style={{ fontSize: '1.75rem', fontWeight: 900 }}>Resources & Courses</h3>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                                    {purchases.map(course => (
                                        <motion.div key={course.id} whileHover={{ y: -5 }} style={{ ...cardStyle, padding: '1.5rem' }}>
                                            <img src={course.thumbnail} alt="" style={{ width: '100%', height: '160px', borderRadius: '20px', objectFit: 'cover', marginBottom: '1.5rem' }} />
                                            <h5 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>{course.title}</h5>
                                            <Link to="/academy" style={{ color: 'var(--color-soar)', fontWeight: 800, fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                Open in Academy <ExternalLink size={14} />
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </main>

                    <aside style={{ display: 'grid', gap: '2rem', height: 'fit-content', position: 'sticky', top: '120px' }}>
                        <div style={{ ...cardStyle, background: '#000', color: '#fff' }}>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.6, marginBottom: '2rem' }}>Quick Actions</h4>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <Link to="/restore/register" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: 'rgba(255,255,255,0.1)', borderRadius: '25px', color: '#fff', textDecoration: 'none', fontWeight: 700 }}>
                                    <MessageSquare size={18} /> New Session
                                </Link>
                                <button onClick={() => navigate('/change-password')} style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', padding: '1.25rem', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '25px', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>
                                    <ShieldCheck size={18} /> Security Settings
                                </button>
                            </div>
                        </div>

                        <div style={cardStyle}>
                            <h4 style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.4, marginBottom: '1.5rem' }}>Profile Summary</h4>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#999', fontWeight: 600, fontSize: '0.9rem' }}>Membership</span>
                                    <span style={{ fontWeight: 800 }}>{user?.role}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#999', fontWeight: 600, fontSize: '0.9rem' }}>Member Since</span>
                                    <span style={{ fontWeight: 800 }}>{new Date(user?.createdAt || Date.now()).getFullYear()}</span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 900px) {
                    .profile-grid { grid-template-columns: 1fr !important; }
                    aside { position: static !important; }
                    h1 { font-size: 2.5rem !important; }
                }
            ` }} />
        </div>
    );
};

export default Profile;
