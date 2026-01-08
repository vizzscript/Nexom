import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { useScrollToTop } from '@/hooks';
import type { ReactNode } from 'react';

/**
 * Main Layout Component
 * Wraps pages with common layout elements
 */

interface MainLayoutProps {
    children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    useScrollToTop();

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
};
