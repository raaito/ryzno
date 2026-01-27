import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Play, Music, FileText, CheckCircle, ChevronRight, Layout, LogOut, Search, ArrowLeft, User, RefreshCcw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import logo from '../assets/1000665431.png';

const Academy = () => {
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [syncMessage, setSyncMessage] = useState('');

    useEffect(() => {
        fetchAcademyData();
    }, [token]);

    const fetchAcademyData = () => {
        setLoading(true);
        fetch('/api/academy', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setCourses(data.courses);
                setLessons(data.lessons);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch academy data:", err);
                setLoading(false);
            });
    };

    const handleSync = async () => {
        setSyncing(true);
        setSyncMessage('');
        try {
            const res = await fetch('/api/auth/sync-selar', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setSyncMessage(data.message);
                fetchAcademyData(); // Refresh list to show new course
            } else {
                setSyncMessage(data.message || 'No new purchases found.');
            }
        } catch (err) {
            setSyncMessage('Failed to connect to sync server.');
        } finally {
            setSyncing(false);
            setTimeout(() => setSyncMessage(''), 5000);
        }
    };

    const getYoutubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                <Layout size={32} color="var(--color-soar)" />
            </motion.div>
        </div>
    );

    const lightGlass = {
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)',
        borderRadius: '20px'
    };

    const filteredLessons = lessons.filter(l => l.courseId === selectedCourse?.id);

    return (
        <div style={{ background: '#f8f9fa', minHeight: '100vh', color: '#1a1a1a' }}>
            <nav style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={logo} alt="RYZNO" style={{ height: '32px', objectFit: 'contain' }} />
                    </Link>
                    <div style={{ width: '1px', height: '20px', background: 'rgba(0,0,0,0.1)' }} className="nav-divider"></div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-soar)', letterSpacing: '1px' }} className="nav-academy-text">S.O.A.R ACADEMY</span>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.85rem', fontWeight: 700 }} className="nav-user">
                        <User size={16} /> {user?.username}
                    </div>
                    {user?.role === 'LECTURER' && (
                        <Link to="/academy/lecturer" style={{ padding: '0.6rem 1.25rem', background: '#000', color: '#fff', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}>Lecturer Panel</Link>
                    )}
                    <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#000', opacity: 0.6, cursor: 'pointer', display: 'flex', alignItems: 'center' }}><LogOut size={20} /></button>
                </div>
            </nav>

            <div className="container" style={{ padding: '4rem 1rem' }}>
                <AnimatePresence mode="wait">
                    {!selectedCourse ? (
                        <motion.div key="courses" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', flexWrap: 'wrap', gap: '2rem' }}>
                                <div>
                                    <h1 className="hero-title" style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem', color: '#000', letterSpacing: '-1px' }}>Welcome, Sentinel</h1>
                                    <p style={{ color: '#666', fontSize: '1.1rem', fontWeight: 500 }}>Select a training path to continue your journey.</p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                                    <button
                                        onClick={handleSync}
                                        disabled={syncing}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '1rem 2rem',
                                            background: '#fff',
                                            border: '1px solid rgba(0,0,0,0.1)',
                                            borderRadius: '50px',
                                            fontWeight: 800,
                                            fontSize: '0.9rem',
                                            cursor: syncing ? 'not-allowed' : 'pointer',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => !syncing && (e.currentTarget.style.background = '#fcfcfc')}
                                        onMouseLeave={(e) => !syncing && (e.currentTarget.style.background = '#fff')}
                                    >
                                        <RefreshCcw size={18} className={syncing ? 'spin' : ''} style={{ color: 'var(--color-soar)' }} />
                                        {syncing ? 'Syncing...' : 'Sync Purchases'}
                                    </button>
                                    {syncMessage && (
                                        <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-soar)' }}>
                                            {syncMessage}
                                        </motion.span>
                                    )}
                                </div>
                            </div>

                            <div className="course-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2.5rem' }}>
                                {courses.map(course => (
                                    <motion.div
                                        key={course.id}
                                        whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}
                                        style={{ ...lightGlass, overflow: 'hidden', cursor: 'pointer', background: '#fff' }}
                                        onClick={() => setSelectedCourse(course)}
                                    >
                                        <div style={{ height: '240px', background: `url(${course.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                                        <div style={{ padding: '2rem' }}>
                                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>{course.title}</h3>
                                            <p style={{ color: '#555', lineHeight: 1.6, marginBottom: '1.5rem' }}>{course.description}</p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-soar)', fontWeight: 800, fontSize: '0.9rem' }}>
                                                Enter Course <ChevronRight size={18} />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ) : !selectedLesson ? (
                        <motion.div key="lessons" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <button onClick={() => setSelectedCourse(null)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                                <ArrowLeft size={18} /> Back to Courses
                            </button>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>{selectedCourse.title}</h1>
                            <p style={{ color: '#666', marginBottom: '4rem' }}>{selectedCourse.description}</p>

                            <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '900px' }}>
                                {filteredLessons.map((lesson, idx) => (
                                    <motion.div
                                        key={lesson.id}
                                        whileHover={{ x: 10 }}
                                        className="lesson-card"
                                        style={{ ...lightGlass, padding: '1.5rem 2rem', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                                        onClick={() => setSelectedLesson(lesson)}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                            <div className="lesson-number" style={{ fontSize: '1.5rem', fontWeight: 900, opacity: 0.1, width: '40px' }}>{(idx + 1).toString().padStart(2, '0')}</div>
                                            <div>
                                                <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{lesson.title}</h4>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--color-soar)', fontWeight: 800, textTransform: 'uppercase' }}>{lesson.type}</span>
                                            </div>
                                        </div>
                                        <div className="play-button-ui" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Play size={18} fill="#000" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="player" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <button onClick={() => setSelectedLesson(null)} style={{ background: 'none', border: 'none', color: '#000', cursor: 'pointer', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
                                ← Exit to {selectedCourse.title}
                            </button>

                            <div className="player-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '4rem' }}>
                                <div className="media-section">
                                    <div className="media-viewport" style={{ aspectRatio: '16/9', background: '#000', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.1)', marginBottom: '2.5rem' }}>
                                        {selectedLesson.type === 'video' ? (
                                            getYoutubeId(selectedLesson.url) ? (
                                                <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${getYoutubeId(selectedLesson.url)}`} frameBorder="0" allowFullScreen title="YouTube video player" />
                                            ) : (
                                                <video controls width="100%" height="100%" src={selectedLesson.url} />
                                            )
                                        ) : (
                                            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', background: 'linear-gradient(135deg, #fff, #f0f0f0)' }}>
                                                <Music size={50} color="var(--color-soar)" />
                                                <audio controls src={selectedLesson.url} />
                                            </div>
                                        )}
                                    </div>
                                    <h2 className="lesson-title" style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '1rem' }}>{selectedLesson.title}</h2>
                                    <p style={{ color: '#555', lineHeight: 1.7, fontSize: '1.1rem' }}>{selectedLesson.description}</p>
                                </div>
                                <div className="sidebar-section" style={{ display: 'grid', gap: '2rem' }}>
                                    <div style={{ ...lightGlass, background: '#fff', padding: '2rem' }}>
                                        <h4 style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1.5rem', color: 'var(--color-soar)' }}>NOTES</h4>
                                        <p style={{ fontSize: '0.95rem', color: '#555', lineHeight: 1.6 }}>{selectedLesson.resources.notes}</p>
                                    </div>
                                    <div style={{ ...lightGlass, background: '#fff', padding: '2rem', borderLeft: '4px solid var(--color-soar)' }}>
                                        <h4 style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1.5rem', color: 'var(--color-soar)' }}>ASSIGNMENT</h4>
                                        <p style={{ fontSize: '0.95rem', color: '#555', lineHeight: 1.6 }}>{selectedLesson.resources.assignment}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                .container { padding: 4rem 2rem !important; }
                
                @media (max-width: 1100px) {
                    .player-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
                    .sidebar-section { grid-template-columns: 1fr 1fr; gap: 1.5rem !important; }
                }

                @media (max-width: 850px) {
                    .hero-title { font-size: 2.2rem !important; }
                    .course-grid { grid-template-columns: 1fr !important; }
                    .sidebar-section { grid-template-columns: 1fr; }
                    .media-viewport { border-radius: 20px !important; margin-bottom: 1.5rem !important; }
                    .lesson-title { font-size: 1.8rem !important; }
                }

                @media (max-width: 600px) {
                    nav { padding: 1rem !important; }
                    .nav-academy-text, .nav-divider, .nav-user { display: none !important; }
                    .academy-container { padding: 2rem 1rem !important; }
                    .lesson-card { padding: 1rem 1.25rem !important; }
                    .lesson-number { width: 30px !important; font-size: 1.2rem !important; }
                    .play-button-ui { display: none !important; }
                }

                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }

                *, *::before, *::after { box-sizing: border-box; }
            ` }} />
        </div>
    );
};

export default Academy;
