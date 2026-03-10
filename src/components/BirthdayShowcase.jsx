import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cake, Heart, Star, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const BirthdayShowcase = () => {
    const [birthdays, setBirthdays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchBirthdays = async () => {
            try {
                const res = await fetch('/api/community/birthdays');
                if (res.ok) {
                    const data = await res.json();
                    setBirthdays(data);
                }
            } catch (err) {
                console.error("Birthday fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBirthdays();
    }, []);

    if (loading || birthdays.length === 0) return null;

    const next = () => setCurrentIndex((prev) => (prev + 1) % birthdays.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + birthdays.length) % birthdays.length);

    return (
        <section style={{ padding: '6rem 2rem', position: 'relative', overflow: 'hidden', background: '#0F172A' }}>
            {/* Animated Background Elements */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', zIndex: 0 }}
            />

            <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1.2rem', borderRadius: '50px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', color: '#F59E0B', marginBottom: '1.5rem' }}
                    >
                        <Cake size={18} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>Celebrations Today</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, color: '#fff', marginBottom: '1.5rem', lineHeight: '1.1' }}
                    >
                        Celebrating Our <span style={{ color: '#F59E0B' }}>Tribe</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}
                    >
                        Join us in sending love and light to those born on this special day.
                    </motion.p>
                </div>

                <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={birthdays[currentIndex]._id || currentIndex}
                            initial={{ opacity: 0, x: 50, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -50, scale: 0.95 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                borderRadius: '40px',
                                padding: '4rem 3rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                boxShadow: '0 40px 100px -20px rgba(0,0,0,0.5)'
                            }}
                        >
                            <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    style={{ position: 'absolute', inset: '-15px', borderRadius: '50%', border: '2px dashed rgba(245, 158, 11, 0.3)' }}
                                />
                                <div style={{ width: '180px', height: '180px', borderRadius: '50%', overflow: 'hidden', border: '5px solid #fff', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                                    {birthdays[currentIndex].profilePicture ? (
                                        <img src={birthdays[currentIndex].profilePicture} alt={birthdays[currentIndex].firstName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '4rem', fontWeight: 900 }}>
                                            {birthdays[currentIndex].firstName[0]}
                                        </div>
                                    )}
                                </div>
                                <motion.div
                                    animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    style={{ position: 'absolute', top: '-20px', right: '-20px', color: '#F59E0B' }}
                                >
                                    <Sparkles size={32} />
                                </motion.div>
                            </div>

                            <h3 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', marginBottom: '0.5rem' }}>{birthdays[currentIndex].firstName} {birthdays[currentIndex].surname}</h3>
                            <div style={{ display: 'flex', gap: '0.5rem', color: '#F59E0B', marginBottom: '2rem' }}>
                                <Heart size={18} fill="#F59E0B" />
                                <Heart size={18} fill="#F59E0B" />
                                <Heart size={18} fill="#F59E0B" />
                            </div>

                            <p style={{ fontSize: '1.4rem', color: 'rgba(255,255,255,0.8)', fontStyle: 'italic', maxWidth: '500px', lineHeight: '1.6', marginBottom: '3rem' }}>
                                "{birthdays[currentIndex].bestThing || "A soul full of light and greatness. May your year be as extraordinary as you are."}"
                            </p>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{ background: '#F59E0B', color: '#fff', padding: '1rem 2.5rem', borderRadius: '50px', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 15px 30px rgba(245, 158, 11, 0.4)' }}
                            >
                                Send a Heartfelt Message
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>

                    {birthdays.length > 1 && (
                        <>
                            <button onClick={prev} style={{ position: 'absolute', left: '-80px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.5, transition: '0.3s' }} onMouseEnter={e => e.target.style.opacity = 1} onMouseLeave={e => e.target.style.opacity = 0.5}>
                                <ChevronLeft size={48} />
                            </button>
                            <button onClick={next} style={{ position: 'absolute', right: '-80px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.5, transition: '0.3s' }} onMouseEnter={e => e.target.style.opacity = 1} onMouseLeave={e => e.target.style.opacity = 0.5}>
                                <ChevronRight size={48} />
                            </button>
                        </>
                    )}
                </div>

                {birthdays.length > 1 && (
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '3rem' }}>
                        {birthdays.map((_, i) => (
                            <div
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                style={{
                                    width: i === currentIndex ? '30px' : '10px',
                                    height: '10px',
                                    borderRadius: '5px',
                                    background: i === currentIndex ? '#F59E0B' : 'rgba(255,255,255,0.2)',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer'
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default BirthdayShowcase;
