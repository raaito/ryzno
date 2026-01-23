import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Timer, ExternalLink, ShieldCheck, Star } from 'lucide-react';

const BookPresaleSection = () => {
    const [settings, setSettings] = useState(null);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        fetch('/api/settings/book-sale')
            .then(res => res.json())
            .then(data => setSettings(data));
    }, []);

    useEffect(() => {
        if (!settings?.expiryDate) return;

        const timer = setInterval(() => {
            const difference = new Date(settings.expiryDate) - new Date();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            } else {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [settings]);

    if (!settings?.isVisible) return null;

    const goldGradient = "linear-gradient(135deg, #FFD700 0%, #B8860B 50%, #8B6508 100%)";
    const darkGlass = {
        background: 'rgba(15, 15, 15, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 215, 0, 0.1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
    };

    return (
        <section style={{
            background: '#0a0a0a',
            padding: '8rem 2rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Accents */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                right: '-5%',
                width: '40%',
                height: '60%',
                background: 'radial-gradient(circle, rgba(184, 134, 11, 0.05) 0%, transparent 70%)',
                filter: 'blur(60px)',
                zIndex: 0
            }} />

            <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1.2fr',
                    gap: '5rem',
                    alignItems: 'center'
                }} className="book-grid">

                    {/* Visual Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                inset: '-20px',
                                background: goldGradient,
                                opacity: 0.15,
                                filter: 'blur(30px)',
                                borderRadius: '30px'
                            }} />
                            <img
                                src={settings.bookImage}
                                alt={settings.title}
                                style={{
                                    width: '100%',
                                    borderRadius: '20px',
                                    boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
                                    border: '1px solid rgba(255, 215, 0, 0.2)'
                                }}
                            />

                            {/* Exclusive Badge */}
                            <div style={{
                                position: 'absolute',
                                top: '30px',
                                right: '-20px',
                                background: goldGradient,
                                padding: '1rem 1.5rem',
                                borderRadius: '12px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                                transform: 'rotate(5deg)'
                            }}>
                                <span style={{ color: '#000', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '1px' }}>ELITE ACCESS</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Content Side */}
                    <div style={{ color: '#fff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '40px', height: '1px', background: goldGradient }} />
                            <span style={{ color: '#B8860B', fontWeight: 800, letterSpacing: '3px', fontSize: '0.8rem' }}>PRE-ORDER EVENT</span>
                        </div>

                        <h2 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '2rem', letterSpacing: '-1px' }}>
                            {settings.title}
                        </h2>

                        <p style={{ fontSize: '1.1rem', opacity: 0.6, lineHeight: 1.8, marginBottom: '3rem', fontWeight: 500 }}>
                            An architectural masterpiece in literature, designed for the discerning few who understand that becoming is the ultimate expression of spiritual excellence. Secure your legacy entry.
                        </p>

                        {/* Pricing & Timer Card */}
                        <div style={{ ...darkGlass, padding: '2.5rem', borderRadius: '30px', marginBottom: '3rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                                <div>
                                    <span style={{ fontSize: '0.8rem', opacity: 0.5, fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>LIMITED PRE-ORDER PRICE</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#FFD700' }}>₦{settings.presalePrice.toLocaleString()}</span>
                                        <span style={{ fontSize: '1.2rem', opacity: 0.3, textDecoration: 'line-through' }}>₦{settings.regularPrice.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <ShieldCheck size={24} style={{ color: '#B8860B', marginBottom: '0.5rem' }} />
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.5 }}>100% SECURE</span>
                                </div>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,215,0,0.1)', marginBottom: '2rem' }} />

                            {/* Timer Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center' }}>
                                {[
                                    { label: 'DAYS', value: timeLeft.days },
                                    { label: 'HOURS', value: timeLeft.hours },
                                    { label: 'MINS', value: timeLeft.minutes },
                                    { label: 'SECS', value: timeLeft.seconds }
                                ].map((t, i) => (
                                    <div key={i}>
                                        <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff' }}>{t.value.toString().padStart(2, '0')}</div>
                                        <div style={{ fontSize: '0.6rem', fontWeight: 800, opacity: 0.4, marginTop: '0.2rem' }}>{t.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Links */}
                        <div style={{ display: 'flex', gap: '1.5rem' }} className="button-stack">
                            <a
                                href={settings.selarLink}
                                target="_blank"
                                style={{
                                    flex: 1,
                                    background: goldGradient,
                                    color: '#000',
                                    textAlign: 'center',
                                    padding: '1.25rem',
                                    borderRadius: '15px',
                                    fontWeight: 900,
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    fontSize: '0.9rem'
                                }}
                            >
                                <ShoppingCart size={20} /> ORDER VIA SELAR
                            </a>
                            <a
                                href={settings.amazonLink}
                                target="_blank"
                                style={{
                                    flex: 1,
                                    background: 'rgba(255,255,255,0.05)',
                                    color: '#fff',
                                    textAlign: 'center',
                                    padding: '1.25rem',
                                    borderRadius: '15px',
                                    fontWeight: 800,
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    fontSize: '0.9rem'
                                }}
                            >
                                <Star size={20} /> ORDER ON AMAZON
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 900px) {
                    .book-grid { grid-template-columns: 1fr !important; gap: 4rem !important; }
                    h2 { font-size: 2.5rem !important; }
                    .button-stack { flex-direction: column !important; }
                }
            `}} />
        </section>
    );
};

export default BookPresaleSection;
