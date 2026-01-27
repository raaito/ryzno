import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RestoreForm from '../components/RestoreForm';

const RestoreRegistration = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: '#fcfcfc' }}>
            <Navbar />

            <main style={{ paddingTop: '140px', paddingBottom: '100px' }}>
                <div className="container">
                    {/* Header */}
                    <div style={{ maxWidth: '900px', margin: '0 auto 4rem auto' }}>
                        <Link to="/restore" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'var(--text-secondary)',
                            textDecoration: 'none',
                            marginBottom: '2rem',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            transition: 'color 0.3s'
                        }} className="back-link">
                            <ArrowLeft size={16} /> Back to Restore
                        </Link>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-restore)', marginBottom: '1rem' }}>
                                <Sparkles size={24} />
                                <span style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>Registration Portal</span>
                            </div>
                            <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 900, color: '#000', letterSpacing: '-2px', marginBottom: '1rem' }}>
                                Book Your <span style={{ color: 'var(--color-restore)' }}>Restore</span> Session
                            </h1>
                            <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px', lineHeight: 1.6 }}>
                                Take the first step towards healing and divine purpose. Fill out the form below to begin your journey of restoration.
                            </p>
                        </motion.div>
                    </div>

                    {/* Form Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        <RestoreForm />
                    </motion.div>
                </div>
            </main>

            <Footer />

            <style dangerouslySetInnerHTML={{
                __html: `
                .back-link:hover { color: var(--color-restore) !important; }
                @media (max-width: 768px) {
                    .container { padding: 0 1.5rem; }
                }
            `}} />
        </div>
    );
};

export default RestoreRegistration;
