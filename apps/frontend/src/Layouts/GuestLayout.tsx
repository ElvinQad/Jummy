import Footer from './Footer';
import Header from './Header';
import MobileMenu from '../components/MobileMenu';
import { Outlet } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';
import { useState } from 'react';

export default function GuestLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            <main className="flex-grow">
                <AnimatedPage>
                    <Outlet />
                </AnimatedPage>
            </main>
            <Footer />
        </div>
    );
}
