import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, Mic2, Music, Users, Volume2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PillarContact from '../components/PillarContact';
import roarImg from '../assets/roar.png';

const Roar = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const components = [
        {
            icon: <Mic2 size={32} />,
            title: "Risen & Ordained",
            desc: "The realization of your spiritual identity and authority. Understanding that you are not just a spectator in the kingdom, but a chosen representative with a specific mandate."
        },
        {
            icon: <Volume2 size={32} />,
            title: "Activated",
            desc: "Moving beyond potential into performance. We help you identify your unique spiritual gifts and 'vocalize' them in the environments you are called to."
        },
        {
            icon: <Music size={32} />,
            title: "Released",
            desc: "The final step of the process where you are sent out to make a meaningful impact. Your roar is the sound of your purpose meeting the world's need."
        }
    ];

    return (
        <div className="roar-page">
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

                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center', marginBottom: '6rem' }} className="roar-hero-grid">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <h1 style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--color-roar)', lineHeight: 1 }}>
                                    ROAR
                                </h1>
                                <p style={{ fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                                    The expressive dimension of the gift of God at work in us. Discovering and working in your divine gifts.
                                </p>

                                <div style={{
                                    display: 'inline-block',
                                    padding: '1rem 2rem',
                                    borderRadius: '12px',
                                    borderLeft: '4px solid var(--color-roar)',
                                    background: 'linear-gradient(to right, rgba(139, 92, 246, 0.05), transparent)',
                                    marginBottom: '2rem'
                                }}>
                                    <p style={{ fontWeight: 600, color: 'var(--color-roar)', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.9rem' }}>
                                        Risen & Ordained. Activated. Released.
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                                style={{ position: 'relative' }}
                            >
                                <div style={{
                                    borderRadius: 'var(--radius-lg)',
                                    overflow: 'hidden',
                                    aspectRatio: '1',
                                    border: '1px solid rgba(139, 92, 246, 0.2)',
                                    boxShadow: '0 20px 60px -10px rgba(139, 92, 246, 0.2)'
                                }}>
                                    <img src={roarImg} alt="Roar Academy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <div style={{
                                        position: 'absolute',
                                        top: 0, left: 0, width: '100%', height: '100%',
                                        background: 'linear-gradient(to bottom, transparent 60%, var(--color-roar))',
                                        opacity: 0.1
                                    }}></div>
                                </div>
                            </motion.div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', marginBottom: '6rem' }}>
                            {components.map((comp, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6, delay: i * 0.2 }}
                                    className="glass"
                                    style={{ padding: '3rem 2rem', textAlign: 'center' }}
                                >
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        margin: '0 auto 2rem auto',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '20px',
                                        background: 'rgba(234, 179, 8, 0.1)',
                                        color: 'var(--color-roar)'
                                    }}>
                                        {comp.icon}
                                    </div>
                                    <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>{comp.title}</h3>
                                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{comp.desc}</p>
                                </motion.div>
                            ))}
                        </div>

                        <PillarContact source="ROAR" color="var(--color-roar)" title="Partner with ROAR" />

                        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>Speak Your Truth</h2>
                            <p style={{ color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto 4rem auto', fontSize: '1.2rem', lineHeight: 1.6 }}>
                                ROAR is not just about making noise; it's about the precision of your spiritual expression. Whether through art, business, leadership, or service, your roar is the authentic expression of the divine genius within you.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
            <style dangerouslySetInnerHTML={{
                __html: `
                .back-link:hover { color: var(--color-roar) !important; }
                @media (max-width: 968px) {
                    .roar-hero-grid { grid-template-columns: 1fr !important; text-align: center; gap: 3rem !important; }
                    .roar-hero-grid div:first-child { order: 2; }
                    .roar-hero-grid div:last-child { order: 1; }
                }
            `}} />
        </div>
    );
};

export default Roar;
