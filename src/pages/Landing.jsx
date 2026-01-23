import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import SoarSection from '../components/SoarSection';
import RestoreSection from '../components/RestoreSection';
import RoarSection from '../components/RoarSection';
import ContactSection from '../components/ContactSection';
import BookPresaleSection from '../components/BookPresaleSection';
import AcademyAdSection from '../components/AcademyAdSection';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="landing">
            <Navbar />
            <main>
                <HeroSection />
                <SoarSection />
                <RestoreSection />
                <RoarSection />
                <BookPresaleSection />
                <AcademyAdSection />
                <ContactSection />
            </main>
            <Footer />
        </div>
    );
};

export default Landing;
