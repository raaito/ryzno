import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, RefreshCw, Zap, Sparkles, Shield, Compass, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PillarContact from '../components/PillarContact';
import restoreImg from '../assets/restore.png';

const Restore = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const principles = [
        { icon: <RefreshCw size={24} />, label: 'Release', desc: 'Letting go of the weight of the wound. Forgiveness starts with the decision to stop carrying the burden of what was done to you.' },
        { icon: <Heart size={24} />, label: 'Embrace', desc: 'Accepting the lessons and the light. Every scar has a story, and every story has a lesson that can illuminate your future.' },
        { icon: <Zap size={24} />, label: 'Surrender', desc: 'Yielding to divine restoration. True healing begins when we stop resisting and start allowing God to rebuild our broken pieces.' },
        { icon: <Sparkles size={24} />, label: 'Transform', desc: 'Renewal shaping identity. You are not defined by what you lost, but by what you are becoming through the process of restoration.' },
        { icon: <Shield size={24} />, label: 'Overcome', desc: 'Triumph through divine strength. The strength gained in the valley is the power that sustains you on the mountain top.' },
        { icon: <Compass size={24} />, label: 'Reclaim', desc: 'Taking back authority and worth. You are a child of the King, and no trauma can strip you of your royal inheritance.' },
        { icon: <Star size={24} />, label: 'Elevate', desc: 'Rising beyond pain into purpose. Your greatest pain often becomes the platform for your greatest ministry.' }
    ];

    return (
        <div className="restore-page">
            <Navbar />
            <main style={{ paddingTop: '100px' }}>
                <section style={{ padding: '4rem 0' }}>
                    <div className="container">
                        <Link to="/" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'var(--text-secondary)',
                            textDecoration: 'none',
                            marginBottom: '2rem',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            transition: 'color 0.3s'
                        }} className="back-link">
                            <ArrowLeft size={16} /> Back to Home
                        </Link>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center', marginBottom: '6rem' }} className="restore-grid">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1 }}
                                style={{ position: 'relative' }}
                            >
                                <div style={{
                                    borderRadius: 'var(--radius-lg)',
                                    overflow: 'hidden',
                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                    boxShadow: '0 0 50px rgba(239, 68, 68, 0.1)'
                                }}>
                                    <img src={restoreImg} alt="Restore Healing" style={{ width: '100%', display: 'block' }} />
                                </div>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                    style={{
                                        position: 'absolute',
                                        bottom: '-2rem',
                                        right: '-1rem',
                                        padding: '1.5rem 2rem',
                                        background: 'rgba(239, 68, 68, 0.85)',
                                        backdropFilter: 'blur(20px)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                        maxWidth: '300px'
                                    }}
                                >
                                    <p style={{ fontStyle: 'italic', fontWeight: 600, fontSize: '1.1rem', color: '#fff' }}>
                                        "What was broken becomes the blueprint for your resurrection."
                                    </p>
                                </motion.div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <h1 style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--color-restore)' }}>
                                    RESTORE
                                </h1>
                                <p style={{ fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
                                    Helping people let go of the weight of the world. We offer consultation sessions to help you transition from trauma into divine purpose.
                                </p>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
                                    Restoration isn't just about going back to how things were; it's about being rebuilt into something stronger, more beautiful, and more resilient than before. Using the philosophy of Kintsugi as a spiritual metaphor, we help you find the gold in your brokenness.
                                </p>
                                <Link to="/restore/register" className="btn-primary" style={{
                                    padding: '1rem 3rem',
                                    background: 'var(--color-restore)',
                                    color: 'white',
                                    textDecoration: 'none',
                                    boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.4)',
                                    border: '1px solid rgba(255,255,255,0.2)'
                                }}>
                                    Book a Session
                                </Link>
                            </motion.div>
                        </div>

                        <div style={{ marginTop: '8rem' }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '4rem', textAlign: 'center' }}>The 7 Pillars of Restoration</h2>
                            <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
                                {principles.map((p, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        className="glass"
                                        style={{
                                            padding: '2rem',
                                            display: 'grid',
                                            gridTemplateColumns: 'auto 1fr',
                                            gap: '2rem',
                                            alignItems: 'start',
                                            borderLeft: '4px solid var(--color-restore)'
                                        }}
                                    >
                                        <div style={{
                                            padding: '1rem',
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            borderRadius: '12px',
                                            color: 'var(--color-restore)'
                                        }}>
                                            {p.icon}
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{p.label}</h3>
                                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{p.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <PillarContact source="RESTORE" color="var(--color-restore)" title="Book a Restoration Session" />
                    </div>
                </section>
            </main>
            <Footer />
            <style dangerouslySetInnerHTML={{
                __html: `
                .back-link:hover { color: var(--color-restore) !important; }
                @media (max-width: 968px) {
                    .restore-grid { grid-template-columns: 1fr !important; gap: 5rem !important; }
                }
            `}} />
        </div>
    );
};

export default Restore;
