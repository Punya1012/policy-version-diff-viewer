import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const NavBar = ({ onNavigate, currentPage }) => {
    const { logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const navItems = [
        { key: 'dashboard', label: '📊 Dashboard' },
        { key: 'list', label: '📋 Policies' },
        { key: 'analytics', label: '📈 Analytics' },
    ];

    return (
        <nav className="bg-blue-600 text-white shadow">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">

                    {/* Logo */}
                    <h1
                        className="text-lg font-bold cursor-pointer"
                        onClick={() => onNavigate('dashboard')}
                    >
                        Policy Diff Viewer
                    </h1>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-3">
                        {navItems.map(item => (
                            <button
                                key={item.key}
                                onClick={() => onNavigate(item.key)}
                                className={`px-3 py-1 rounded text-sm font-medium ${
                                    currentPage === item.key
                                        ? 'bg-white text-blue-600'
                                        : 'text-white hover:text-blue-200'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                        <button
                            onClick={logout}
                            className="px-4 py-1 bg-white text-blue-600 rounded hover:bg-blue-50 text-sm font-medium"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        className="md:hidden text-white text-2xl"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? '✕' : '☰'}
                    </button>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden mt-3 pb-3 border-t border-blue-500">
                        {navItems.map(item => (
                            <button
                                key={item.key}
                                onClick={() => {
                                    onNavigate(item.key);
                                    setMenuOpen(false);
                                }}
                                className={`block w-full text-left px-3 py-2 rounded mt-1 text-sm ${
                                    currentPage === item.key
                                        ? 'bg-white text-blue-600'
                                        : 'text-white hover:bg-blue-500'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                        <button
                            onClick={logout}
                            className="block w-full text-left px-3 py-2 rounded mt-1 text-sm text-white hover:bg-blue-500"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBar;