import React, { useState } from 'react';
import { Menu, X, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import logo from '../assets/1000665431.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'SOAR', href: '#soar' },
    { name: 'RESTORE', href: '#restore' },
    { name: 'ROAR', href: '#roar' },
  ];

  return (
    <>
      <nav className="glass" style={{
        position: 'fixed',
        top: '1.25rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '92%',
        maxWidth: '1200px',
        zIndex: 1000,
        padding: '0.6rem 1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '100px',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--glass-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src={logo} alt="RYZNO" style={{ height: '40px', objectFit: 'contain' }} />
        </div>

        {/* Desktop Links */}
        <div className="desktop-nav" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.8, color: 'var(--text-primary)', transition: 'all 0.3s ease' }}>
              {link.name}
            </a>
          ))}
          <button className="glow-soar" style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '50px',
            fontSize: '0.8rem',
            fontWeight: 700,
            background: 'var(--color-soar)',
            color: 'white',
            border: 'none',
            marginLeft: '0.5rem',
            cursor: 'pointer'
          }} onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
            Contact
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', display: 'none', cursor: 'pointer' }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <style dangerouslySetInnerHTML={{
          __html: `
          @media (max-width: 768px) {
            .desktop-nav { display: none !important; }
            .mobile-toggle { display: block !important; }
            nav { top: 0.75rem !important; padding: 0.5rem 1rem !important; }
          }
          .desktop-nav a:hover { opacity: 1 !important; color: var(--color-soar) !important; }
        ` }} />
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: '5rem',
              left: '5%',
              width: '90%',
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '2rem',
              zIndex: 999,
              border: '1px solid var(--glass-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}
              >
                {link.name}
              </a>
            ))}
            <button
              className="glow-soar"
              style={{
                padding: '1rem',
                borderRadius: '50px',
                fontSize: '1rem',
                fontWeight: 800,
                background: 'var(--color-soar)',
                color: 'white',
                border: 'none'
              }}
              onClick={() => { setIsOpen(false); document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }); }}
            >
              Contact Us
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
