import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import soarImg from '../assets/soar.png';

const SoarSection = () => {
    return (
        <section id="soar" style={{ padding: '8rem 0', background: 'var(--bg-darker)', position: 'relative', overflow: 'hidden' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(2rem, 8vw, 6rem)', alignItems: 'center' }} className="soar-grid">

                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 style={{ fontSize: 'clamp(2.5rem, 8vw, 3.5rem)', marginBottom: '1.5rem', color: 'var(--color-soar)', fontWeight: 800 }}>S.O.A.R</h2>
                            <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>The Guardians of Culture</h3>
                            <p style={{ fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '2.5rem' }}>
                                We cultivate individuals who embody authenticity and moral authority—people who are as spiritually grounded as they are culturally relevant.
                            </p>

                            <div className="glass" style={{ padding: '2rem', marginBottom: '2.5rem', borderLeft: '4px solid var(--color-soar)' }}>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem', lineHeight: 1.6 }}>
                                    Through the SOAR pillar, we raise **Watchers**, **Guardians**, and **Mystics**—individuals equipped to discern spiritual trends and preserve truth in a rapidly changing world.
                                </p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {['Watchers: Spiritual Vigilance', 'Guardians: Moral Strength', 'Mystics: Spiritual Decoding'].map((item, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-soar)' }}></div>
                                            <span style={{ fontWeight: 500 }}>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Link to="/soar" className="btn-primary" style={{ background: 'var(--color-soar)', borderColor: 'var(--color-soar)', color: '#fff' }}>
                                Explore S.O.A.R
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div style={{
                                borderRadius: 'var(--radius-lg)',
                                overflow: 'hidden',
                                aspectRatio: '16/10',
                                border: '1px solid rgba(245, 158, 11, 0.2)',
                                position: 'relative',
                                boxShadow: '0 0 50px rgba(245, 158, 11, 0.1)'
                            }}>
                                <img src={soarImg} alt="SOAR Academy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{
                                    position: 'absolute',
                                    top: 0, left: 0, width: '100%', height: '100%',
                                    background: 'linear-gradient(to top, rgba(245, 158, 11, 0.1), transparent)'
                                }}></div>
                            </div>
                        </motion.div>
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
