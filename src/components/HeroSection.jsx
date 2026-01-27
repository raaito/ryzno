import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Target, Award, ArrowRight } from 'lucide-react';
import heroImg1 from '../assets/hero.png';
import soarImg from '../assets/soar.png';
import restoreImg from '../assets/restore.png';
import roarImg from '../assets/roar.png';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [
        {
            image: heroImg1,
            tag: "The Movement",
            title: "RYZNO",
            subtitle: "Risen and Ordained. Leading a generation of systems, accountability, and divine responsibility.",
            color: "var(--color-soar)",
            btnText: "Learn More",
            path: "/about",
            glow: "glow-soar"
        },
        {
            image: soarImg,
            tag: "The Academy",
            title: "S.O.A.R",
            subtitle: "Cultivating leaders as Sentinels in a shifting culture through rigorous spiritual and practical training.",
            color: "var(--color-soar)",
            btnText: "Explore SOAR",
            path: "/soar",
            glow: "glow-soar"
        },
        {
            image: restoreImg,
            tag: "The Healing",
            title: "RESTORE",
            subtitle: "Where what was broken becomes the architectural blueprint for your divine purpose and healing.",
            color: "var(--color-restore)",
            btnText: "Book Session",
            path: "/restore",
            glow: "glow-restore"
        },
        {
            image: roarImg,
            tag: "The Expression",
            title: "ROAR",
            subtitle: "Unleashing the dimensions of the raw gifts of God at work in you through creative expression.",
            color: "var(--color-roar)",
            btnText: "Discover ROAR",
            path: "/roar",
            glow: "glow-roar"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const values = [
        { icon: <Shield size={20} />, label: "Accountability", color: "var(--color-soar)" },
        { icon: <Target size={20} />, label: "Responsibility", color: "var(--color-restore)" },
        { icon: <Award size={20} />, label: "Authenticity", color: "var(--text-primary)" }
    ];

    return (
        <section id="home" style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            background: 'var(--bg-primary)',
            width: '100%'
        }}>
            {/* Background Slider */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 0.6, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${slides[currentSlide].image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        zIndex: 0,
                        filter: 'none'
                    }}
                />
            </AnimatePresence>

            {/* Overlay Vignette */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at center, transparent 30%, var(--bg-primary) 95%)',
                zIndex: 1
            }}></div>

            <div className="container" style={{
                textAlign: 'center',
                position: 'relative',
                zIndex: 2,
                paddingTop: 'clamp(6rem, 15vh, 10rem)',
                paddingBottom: 'clamp(4rem, 10vh, 6rem)',
                width: '100%',
                maxWidth: '100vw',
                overflow: 'hidden',
                boxSizing: 'border-box'
            }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{ width: '100%' }}
                    >
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.5rem 1.25rem',
                            borderRadius: '100px',
                            background: 'rgba(255,255,255,0.5)',
                            border: '1px solid rgba(0,0,0,0.05)',
                            marginBottom: '1.5rem',
                            fontSize: 'clamp(0.7rem, 2vw, 0.85rem)',
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            fontWeight: 700,
                            color: 'var(--text-secondary)'
                        }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: slides[currentSlide].color, display: 'inline-block' }}></span>
                            {slides[currentSlide].tag}
                        </div>

                        <h1 style={{
                            fontSize: 'clamp(3rem, 18vw, 10rem)',
                            marginBottom: '1rem',
                            lineHeight: 0.8,
                            fontWeight: 900,
                            letterSpacing: '-0.04em',
                            width: '100%',
                            padding: '0 10px',
                            boxSizing: 'border-box',
                            color: 'var(--text-primary)',
                            textShadow: '0 0 30px rgba(255,255,255,0.8)'
                        }}>
                            {slides[currentSlide].title}
                        </h1>
                        <p style={{
                            fontSize: 'clamp(0.95rem, 4vw, 2.2rem)',
                            color: 'var(--text-primary)',
                            textShadow: '0 0 30px rgba(255,255,255,0.8)',
                            maxWidth: '100%',
                            width: '700px',
                            margin: '0 auto 3rem auto',
                            fontWeight: 400,
                            lineHeight: 1.3,
                            letterSpacing: '-0.01em',
                            padding: '0 20px',
                            boxSizing: 'border-box'
                        }}>
                            {slides[currentSlide].subtitle}
                        </p>

                        <div className="hero-buttons" style={{
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'center',
                            marginBottom: '4rem',
                            padding: '0 20px'
                        }}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={slides[currentSlide].glow} style={{
                                    padding: '1rem 2rem',
                                    borderRadius: '50px',
                                    fontSize: '0.95rem',
                                    fontWeight: 800,
                                    background: slides[currentSlide].color,
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                    boxShadow: `0 10px 30px ${slides[currentSlide].color}44`,
                                    minWidth: '180px',
                                    transition: 'all 0.3s ease'
                                }} onClick={() => navigate(slides[currentSlide].path)}>
                                {slides[currentSlide].btnText}
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05, background: 'rgba(0,0,0,0.05)' }}
                                whileTap={{ scale: 0.95 }}
                                className="glass" style={{
                                    padding: '1rem 2rem',
                                    borderRadius: '50px',
                                    fontSize: '0.95rem',
                                    fontWeight: 600,
                                    color: 'var(--text-primary)',
                                    cursor: 'pointer',
                                    minWidth: '160px'
                                }} onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
                                Inquiry
                            </motion.button>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Values grid (always visible) */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '1.5rem',
                    maxWidth: '1100px',
                    margin: '0 auto',
                    padding: '0 20px',
                    boxSizing: 'border-box'
                }} className="values-grid">
                    {values.map((v, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                            whileHover={{ y: -5, background: 'rgba(255,255,255,0.8)', borderColor: v.color }}
                            className="glass" style={{ padding: '2rem 1.5rem', textAlign: 'center', cursor: 'default', transition: 'border-color 0.4s ease', background: 'rgba(255,255,255,0.5)' }}>
                            <div style={{ color: v.color, marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 4, delay: i }}>
                                    {v.icon}
                                </motion.div>
                            </div>
                            <h4 style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-primary)' }}>{v.label}</h4>
                        </motion.div>
                    ))}
                </div>

                {/* Slider Indicators */}
                <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.75rem' }}>
                    {slides.map((_, i) => (
                        <div key={i} onClick={() => setCurrentSlide(i)} style={{
                            width: currentSlide === i ? '30px' : '8px',
                            height: '8px',
                            borderRadius: '100px',
                            background: currentSlide === i ? slides[currentSlide].color : 'rgba(0,0,0,0.1)',
                            transition: 'all 0.4s ease',
                            cursor: 'pointer'
                        }}></div>
                    ))}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 640px) {
                    .hero-buttons { flex-direction: column !important; align-items: stretch !important; }
                    .hero-buttons button { width: 100% !important; }
                    .values-grid { grid-template-columns: 1fr !important; }
                    h1 { letter-spacing: -2px !important; }
                }
            ` }} />
        </section>
    );
};

export default HeroSection;
