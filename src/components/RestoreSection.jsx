import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import restoreImg from '../assets/restore.png';

const RestoreSection = () => {
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
                                RENOVATION
                            </h2>
                            <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>RESTORE for Ryznovation</h3>
                            <p style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)', color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
                                Helping people let go of the weight of the world. We offer consultation sessions to help you transition from trauma into divine purpose.
                            </p>

                            <div className="glass" style={{ padding: '2rem', marginBottom: '2.5rem', borderLeft: '4px solid var(--color-restore)' }}>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>The Path to Whole-ness</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                                    Our restoration process follows seven core principles—from Release to Elevate—designed to help you find the "gold" in your broken pieces.
                                </p>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {['Release', 'Embrace', 'Surrender', 'Transform', 'Overcome', 'Reclaim', 'Elevate'].map((p, i) => (
                                        <span key={i} style={{ fontSize: '0.75rem', padding: '0.3rem 0.8rem', borderRadius: '20px', background: 'rgba(239, 68, 68, 0.05)', color: 'var(--color-restore)', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                                            {p}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <Link to="/restore" className="btn-primary" style={{ background: 'var(--color-restore)', borderColor: 'var(--color-restore)' }}>
                                Learn About Renovation
                            </Link>
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
