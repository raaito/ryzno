import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import SoarSection from '../components/SoarSection';
import RestoreSection from '../components/RestoreSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import { Zap } from 'lucide-react';

const Landing = () => {
    return (
        <div className="landing">
            <Navbar />
            <main>
                <HeroSection />
                <SoarSection />
                <RestoreSection />

                {/* ROAR Section */}
                <section id="roar" style={{ padding: '8rem 0', background: 'var(--bg-darker)', textAlign: 'center' }}>
                    <div className="container" style={{ maxWidth: '900px' }}>
                        <div className="glass" style={{ padding: '6rem 2rem' }}>
                            <Zap size={48} color="var(--color-roar)" style={{ margin: '0 auto 2rem auto' }} />
                            <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>ROAR</h2>
                            <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
                                The expressive dimension of the gift of God at work in us. Discovering and working in your divine gifts.
                            </p>
                            <div style={{
                                display: 'inline-block',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '100px',
                                border: '1px solid var(--color-roar)',
                                color: 'var(--color-roar)',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '2px'
                            }}>
                                Risen & Ordained. Activated. Released.
                            </div>
                        </div>
                    </div>
                </section>

                <ContactSection />
            </main>
            <Footer />
        </div>
    );
};

export default Landing;
