import React from 'react';
import { motion } from 'framer-motion';
import restoreImg from '../assets/restore.png';

const RestoreSection = () => {
    const principles = [
        { label: 'Release', desc: 'Letting go of the weight of the wound.' },
        { label: 'Embrace', desc: 'Accepting the lessons and the light.' },
        { label: 'Surrender', desc: 'Yielding to divine restoration.' },
        { label: 'Transform', desc: 'Renewal shaping identity.' },
        { label: 'Overcome', desc: 'Triumph through divine strength.' },
        { label: 'Reclaim', desc: 'Taking back authority and worth.' },
        { label: 'Elevate', desc: 'Rising beyond pain into purpose.' }
    ];

    return (
        <section id="restore" style={{ padding: '8rem 0', background: 'var(--bg-dark)', position: 'relative' }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr',
                    gap: 'clamp(2rem, 8vw, 6rem)',
                    alignItems: 'center'
                }} className="restore-grid">

                    <div style={{ position: 'relative' }} className="restore-image-container">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            style={{
                                borderRadius: 'var(--radius-lg)',
                                overflow: 'hidden',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                boxShadow: '0 0 50px rgba(239, 68, 68, 0.05)'
                            }}
                        >
                            <img src={restoreImg} alt="Restore Healing" style={{ width: '100%', display: 'block', opacity: 0.8 }} />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            style={{
                                position: 'absolute',
                                bottom: '-4rem',
                                right: '-1.5rem',
                                width: '75%',
                                padding: '1.5rem',
                                borderRadius: 'var(--radius-md)',
                                background: 'rgba(239, 68, 68, 0.1)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(239, 68, 68, 0.2)'
                            }}
                            className="floating-quote"
                        >
                            <p style={{ fontSize: '1rem', fontStyle: 'italic', fontWeight: 500, lineHeight: 1.4 }}>
                                "What was broken becomes the blueprint for your resurrection."
                            </p>
                        </motion.div>
                    </div>

                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 style={{ fontSize: 'clamp(2.5rem, 8vw, 3.5rem)', marginBottom: '1.5rem', lineHeight: 1.1, fontWeight: 800 }}>
                                RESTORE
                            </h2>
                            <p style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)', color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
                                Helping people let go of the weight of the world. We offer consultation sessions to help you transition from trauma into divine purpose.
                            </p>

                            <div style={{ display: 'grid', gap: '0.75rem' }}>
                                {principles.map((p, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: i * 0.1 }}
                                        className="glass"
                                        style={{
                                            padding: '1rem 1.25rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1.25rem',
                                            borderLeft: '3px solid var(--color-restore)'
                                        }}>
                                        <span style={{
                                            fontFamily: 'Outfit',
                                            fontWeight: 800,
                                            fontSize: '1.1rem',
                                            color: 'var(--color-restore)',
                                            minWidth: '1.25rem'
                                        }}>{p.label[0]}</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{p.label}</h4>
                                            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }}></div>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{p.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @media (max-width: 968px) {
          .restore-grid { grid-template-columns: 1fr !important; gap: 5rem !important; }
          .restore-image-container { order: 1; }
          .floating-quote { width: 85% !important; bottom: -3rem !important; right: 0 !important; }
          #restore { padding: 4rem 0 !important; }
        }
      ` }} />
        </section>
    );
};

export default RestoreSection;
