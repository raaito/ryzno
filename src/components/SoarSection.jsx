import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Shield, Sparkles } from 'lucide-react';
import soarImg from '../assets/soar.png';

const SoarSection = () => {
    const cards = [
        {
            icon: <Eye size={32} color="var(--color-soar)" />,
            title: "Watchers",
            desc: "Observing trends, spirits, and systems without being shaped by them.",
            items: ['Vigilance', 'Perception', 'Discernment']
        },
        {
            icon: <Shield size={32} color="var(--color-soar)" />,
            title: "Guardians",
            desc: "Preserving truth and legacy in a shifting culture.",
            items: ['Stewardship', 'Moral Strength', 'Preservation']
        },
        {
            icon: <Sparkles size={32} color="var(--color-soar)" />,
            title: "Mystics",
            desc: "Decoding unseen structures shaping human behaviour as revealed by the spirit.",
            items: ['Reflection', 'Intuition', 'Decoding']
        }
    ];

    return (
        <section id="soar" style={{ padding: '8rem 0', background: 'var(--bg-darker)', position: 'relative', overflow: 'hidden' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.2fr', gap: 'clamp(2rem, 8vw, 6rem)', alignItems: 'center' }} className="soar-grid">

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 style={{ fontSize: 'clamp(2.5rem, 8vw, 3.5rem)', marginBottom: '1.5rem', color: 'var(--color-soar)', fontWeight: 800 }}>S.O.A.R</h2>
                        <p style={{ fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '2.5rem' }}>
                            We cultivate individuals who embody authenticity and moral authority—people who are as spiritually grounded as they are culturally relevant.
                        </p>

                        <div style={{
                            borderRadius: 'var(--radius-lg)',
                            overflow: 'hidden',
                            aspectRatio: '16/10',
                            border: '1px solid rgba(245, 158, 11, 0.2)',
                            position: 'relative'
                        }}>
                            <img src={soarImg} alt="SOAR Academy" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                            <div style={{
                                position: 'absolute',
                                top: 0, left: 0, width: '100%', height: '100%',
                                background: 'linear-gradient(to bottom, transparent 60%, var(--bg-darker))'
                            }}></div>
                        </div>
                    </motion.div>

                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {cards.map((card, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.2 }}
                                whileHover={{ x: 10, borderColor: 'var(--color-soar)' }}
                                className="glass"
                                style={{ padding: '2rem', transition: 'border-color 0.3s ease' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
                                    <div className="glass" style={{ padding: '0.6rem', borderRadius: '10px' }}>{card.icon}</div>
                                    <h3 style={{ fontSize: '1.5rem' }}>{card.title}</h3>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem', fontSize: '0.95rem' }}>{card.desc}</p>
                                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                    {card.items.map((item, idx) => (
                                        <span key={idx} style={{
                                            fontSize: '0.7rem',
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '50px',
                                            background: 'rgba(245, 158, 11, 0.05)',
                                            color: 'var(--color-soar)',
                                            border: '1px solid rgba(245, 158, 11, 0.1)',
                                            fontWeight: 600,
                                            textTransform: 'uppercase'
                                        }}>{item}</span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @media (max-width: 968px) {
          .soar-grid { grid-template-columns: 1fr !important; gap: 4rem !important; }
          #soar { padding: 4rem 0 !important; }
        }
      ` }} />
        </section>
    );
};

export default SoarSection;
