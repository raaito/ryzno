import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import roarImg from '../assets/roar.png';

const RoarSection = () => {
    return (
        <section id="roar" style={{ padding: '8rem 0', background: 'var(--bg-darker)', position: 'relative', overflow: 'hidden' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(2rem, 8vw, 6rem)', alignItems: 'center' }} className="roar-grid">

                    {/* Text Section (Left) */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 style={{ fontSize: 'clamp(2.5rem, 8vw, 3.5rem)', marginBottom: '1.5rem', color: 'var(--color-roar)', fontWeight: 800 }}>
                            STUDIOS
                        </h2>
                        <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>ROAR for Ryzno Studios</h3>
                        <p style={{ fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '2.5rem' }}>
                            The expressive dimension of the gift of God at work in you. We empower you to find your voice and release your unique sound into the world.
                        </p>

                        <div className="glass" style={{ padding: '2rem', marginBottom: '2.5rem', borderLeft: '4px solid var(--color-roar)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[
                                    { title: 'Risen', desc: 'Stand tall in your identity' },
                                    { title: 'Ordained', desc: 'Walk in divine appointment' },
                                    { title: 'Activated', desc: 'Ignite your inner potential' },
                                    { title: 'Released', desc: 'Impact your sphere of influence' }
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-roar)' }}></div>
                                        <div>
                                            <span style={{ fontWeight: 700, color: 'var(--color-roar)' }}>{item.title}</span>
                                            <span style={{ margin: '0 0.5rem', color: 'var(--text-secondary)' }}>•</span>
                                            <span style={{ color: 'var(--text-secondary)' }}>{item.desc}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Link to="/roar" className="btn-primary" style={{ background: 'var(--color-roar)', borderColor: 'var(--color-roar)', color: '#fff' }}>
                            Explore Studios
                        </Link>
                    </motion.div>

                    {/* Image Section (Right) */}
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
                            border: '1px solid rgba(139, 92, 246, 0.2)', // Violet border
                            position: 'relative',
                            boxShadow: '0 20px 50px -10px rgba(139, 92, 246, 0.3)'
                        }}>
                            <img src={roarImg} alt="Roar Academy" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.05)' }} />
                            <div style={{
                                position: 'absolute',
                                top: 0, left: 0, width: '100%', height: '100%',
                                background: 'linear-gradient(to top, rgba(139, 92, 246, 0.1), transparent)'
                            }}></div>
                        </div>
                    </motion.div>

                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @media (max-width: 968px) {
          .roar-grid { grid-template-columns: 1fr !important; gap: 4rem !important; }
          #roar { padding: 4rem 0 !important; }
        }
      ` }} />
        </section>
    );
};

export default RoarSection;
