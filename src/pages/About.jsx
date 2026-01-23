import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Heart, Zap, Award, Target, Compass, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import heroImg from '../assets/about_hero.png';
import soarImg from '../assets/soar.png';
import restoreImg from '../assets/restore.png';
import roarImg from '../assets/roar.png';
import BookPresaleSection from '../components/BookPresaleSection';

const About = () => {
    const pillars = [
        {
            title: "S.O.A.R",
            icon: <Shield size={32} color="var(--color-soar)" />,
            description: "Sentinel training for the modern age. We cultivate spiritual watchers and guardians who stand as moral authorities in a shifting culture.",
            tag: "Rise & Ordain",
            color: "var(--color-soar)",
            image: soarImg,
            link: "/soar"
        },
        {
            title: "RESTORE",
            icon: <Heart size={32} color="var(--color-restore)" />,
            description: "A path to inner healing and total transformation. We help individuals recover their original blueprint and walk in divine wholeness.",
            tag: "Heal & Rebuild",
            color: "var(--color-restore)",
            image: restoreImg,
            link: "/restore"
        },
        {
            title: "ROAR",
            icon: <Zap size={32} color="var(--color-roar)" />,
            description: "The expressive dimension of the gift of God. We help you discover, activate, and release the divine potential locked within you.",
            tag: "Activate & Release",
            color: "var(--color-roar)",
            image: roarImg,
            link: "/roar"
        }
    ];

    return (
        <div className="about-page" style={{ background: 'var(--bg-primary)' }}>
            <Navbar />

            <main>
                <section style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'var(--bg-primary)',
                    width: '100%',
                    paddingTop: '120px'
                }}>
                    {/* Background Layer */}
                    <motion.div
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 0.12, scale: 1 }}
                        transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundImage: `url(${heroImg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            zIndex: 0
                        }}
                    />

                    {/* Overlay Vignette */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'radial-gradient(circle at center, transparent 20%, var(--bg-primary) 100%)',
                        zIndex: 1
                    }}></div>

                    <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <span style={{
                                textTransform: 'uppercase',
                                letterSpacing: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                color: 'var(--color-soar)',
                                display: 'block',
                                marginBottom: '2rem',
                                opacity: 0.8
                            }}>The Legacy of Restoration</span>
                            <h1 className="gradient-text" style={{
                                fontSize: 'clamp(3rem, 10vw, 7.5rem)',
                                lineHeight: 0.95,
                                marginBottom: '2.5rem',
                                fontWeight: 900,
                                letterSpacing: '-0.04em'
                            }}>
                                Beyond the Ordinary.<br />Into the Divine.
                            </h1>
                            <p style={{
                                fontSize: '1.4rem',
                                color: 'var(--text-secondary)',
                                maxWidth: '800px',
                                margin: '0 auto',
                                lineHeight: 1.6,
                                fontWeight: 300,
                                letterSpacing: '0.01em'
                            }}>
                                RYZNO is a movement dedicated to the restoration of human dignity, spiritual authority, and the activation of divine purpose.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Vision Section */}
                <section style={{ padding: '12rem 0', background: 'var(--bg-secondary)', position: 'relative', overflow: 'hidden' }}>
                    <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '6rem', alignItems: 'center' }}>
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1 }}
                            >
                                <h2 style={{ fontSize: '3.5rem', marginBottom: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>The Vision</h2>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.2rem', fontWeight: 300, lineHeight: 1.7 }}>
                                    In a world characterized by complexity and noise, we provide a sanctuary for deep spiritual growth and practical empowerment. Our vision is to raise a generation of 'Sentinels'—individuals who are spiritually grounded, morally upright, and practically equipped to lead and transform their communities.
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    {[
                                        { icon: <Compass size={24} />, text: "Spiritual Grounding" },
                                        { icon: <Target size={24} />, text: "Divine Alignment" },
                                        { icon: <Award size={24} />, text: "Moral Authority" }
                                    ].map((item, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.1rem' }}>
                                            <div style={{
                                                color: 'var(--color-soar)',
                                                background: 'rgba(245, 158, 11, 0.05)',
                                                padding: '1rem',
                                                borderRadius: '16px'
                                            }}>{item.icon}</div>
                                            <span style={{ letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.85rem' }}>{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="glass"
                                style={{
                                    padding: '4rem',
                                    aspectRatio: '1',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    border: '1px solid rgba(0,0,0,0.03)',
                                    backdropFilter: 'blur(40px)'
                                }}
                            >
                                {/* Subtle Background Image */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backgroundImage: `url(${heroImg})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    opacity: 0.05,
                                    mixBlendMode: 'luminosity',
                                    zIndex: 0,
                                    pointerEvents: 'none'
                                }}></div>

                                <div style={{
                                    position: 'absolute',
                                    top: '-20%',
                                    right: '-20%',
                                    width: '80%',
                                    height: '80%',
                                    background: 'radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, transparent 70%)',
                                    zIndex: 1
                                }}></div>
                                <div style={{ position: 'relative', zIndex: 2 }}>
                                    <h3 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--color-soar)', fontWeight: 900, letterSpacing: '-0.02em' }}>Many Lives<br />Transformed</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 300, lineHeight: 1.6 }}>Through our academy and healing sessions, we've helped many individuals rediscover their path and purpose.</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Pillars Section */}
                <section className="container" style={{ padding: '12rem 0' }}>
                    <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
                        <h2 style={{ fontSize: '4rem', marginBottom: '1.5rem', fontWeight: 900, letterSpacing: '-0.03em' }}>Core Pillars</h2>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto', fontSize: '1.25rem', fontWeight: 300 }}>
                            Built upon three foundational dimensions of growth, alignment, and divine impact.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '3rem' }}>
                        {pillars.map((pillar, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.8 }}
                                className="glass"
                                style={{
                                    padding: '4rem 3rem',
                                    transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                                    border: '1px solid rgba(0,0,0,0.02)',
                                    background: 'rgba(255,255,255,0.4)'
                                }}
                                whileHover={{ y: -15, background: 'rgba(255,255,255,0.8)', boxShadow: '0 40px 80px rgba(0,0,0,0.05)' }}
                            >
                                {/* Subtle Thematic Background */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backgroundImage: `url(${pillar.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    opacity: 0.04,
                                    mixBlendMode: 'luminosity',
                                    zIndex: 0,
                                    pointerEvents: 'none'
                                }}></div>

                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <div style={{
                                        marginBottom: '3rem',
                                        background: 'var(--bg-primary)',
                                        width: 'fit-content',
                                        padding: '1.25rem',
                                        borderRadius: '20px',
                                        boxShadow: '0 10px 20px rgba(0,0,0,0.02)'
                                    }}>{pillar.icon}</div>
                                    <h3 style={{ fontSize: '2rem', marginBottom: '1.25rem', fontWeight: 800 }}>{pillar.title}</h3>
                                    <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.1rem', lineHeight: 1.7, fontWeight: 300 }}>{pillar.description}</p>
                                    <Link to={pillar.link} style={{
                                        display: 'inline-block',
                                        padding: '0.6rem 1.5rem',
                                        borderRadius: '100px',
                                        fontSize: '0.7rem',
                                        fontWeight: 800,
                                        border: `1px solid ${pillar.color}`,
                                        color: pillar.color,
                                        textTransform: 'uppercase',
                                        letterSpacing: '2px',
                                        opacity: 0.8,
                                        textDecoration: 'none'
                                    }}>
                                        {pillar.tag}
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Visionary Section */}
                <section style={{ padding: '10rem 0', background: 'var(--text-primary)', color: 'white', position: 'relative' }}>
                    {/* Background decoration */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '40%',
                        height: '100%',
                        background: 'linear-gradient(to left, rgba(245, 158, 11, 0.05), transparent)',
                        pointerEvents: 'none'
                    }}></div>

                    <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '6rem', alignItems: 'center' }}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                style={{ position: 'relative' }}
                            >
                                <div style={{
                                    width: '100%',
                                    aspectRatio: '0.85',
                                    borderRadius: '40px',
                                    boxShadow: '0 60px 100px rgba(0,0,0,0.4)',
                                    overflow: 'hidden',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    position: 'relative'
                                }}>
                                    <img
                                        src="/visioner.jpg"
                                        alt="Victor Achimugu"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            objectPosition: 'center'
                                        }}
                                    />
                                </div>
                                <div style={{
                                    position: 'absolute',
                                    bottom: '-3rem',
                                    right: '-2rem',
                                    background: 'var(--color-soar)',
                                    padding: '2.5rem',
                                    borderRadius: '32px',
                                    boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
                                    maxWidth: '280px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    opacity: '0.9'
                                }}>
                                    <p style={{ fontWeight: 800, fontSize: '1.25rem', color: 'white', fontStyle: 'italic', lineHeight: 1.4, marginBottom: '0.5rem' }}>
                                        "If we don't know how to use the capitals at our disposal, we will be beggarly."
                                    </p>
                                    <div style={{ width: '40px', height: '2px', background: 'white', opacity: 0.5 }}></div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <span style={{ color: 'var(--color-soar)', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.8rem', display: 'block', marginBottom: '1.5rem' }}>The Visionary</span>
                                <h2 style={{ fontSize: '3.5rem', marginBottom: '2rem', color: 'white' }}>Victor Achimugu</h2>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                                    Victor Achimugu is a transformation architect, spiritual mentor, and the catalyst behind Ryzno. With a profound commitment to unlocking human potential, Victor has dedicated his life to teaching the principles of spiritual authority and divine alignment.
                                </p>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '3rem' }}>
                                    His approach combines deep spiritual insights with practical strategies for personal and community leadership. Through Ryzno, he continues to lead a movement of individuals who are rising from the ordinary into their ordained positions of influence.
                                </p>
                                <button style={{
                                    padding: '1.25rem 2.5rem',
                                    background: 'var(--color-soar)',
                                    color: 'white',
                                    borderRadius: '100px',
                                    fontWeight: 800,
                                    fontSize: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    cursor: 'pointer'
                                }}>
                                    Connect with Victor <ArrowRight size={20} />
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </main>

            <BookPresaleSection />
            <Footer />
        </div>
    );
};

export default About;
