import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';

const Layout = () => {
    const { user, loading } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (loading) {
        return <div className="h-screen w-full flex items-center justify-center bg-[hsl(var(--background))]"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <ThemeProvider>
            <div className="flex h-screen bg-[hsl(var(--background))] overflow-hidden relative">
                {/* Overlay for mobile menu */}
                {isMobileMenuOpen && (
                    <div 
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                        onClick={toggleMobileMenu}
                    ></div>
                )}

                <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
                
                <div className="flex-1 flex flex-col h-screen w-full overflow-hidden transition-all duration-300">
                    <Navbar onMenuClick={toggleMobileMenu} />
                    <main className="flex-1 overflow-y-auto w-full p-4 md:p-8 relative">
                        {/* Decorative gradient blob background */}
                        <div className="fixed top-20 right-0 w-96 h-96 bg-primary-100/20 dark:bg-primary-900/10 blur-3xl rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
                        <div className="relative z-10 max-w-7xl mx-auto">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default Layout;
