import { useAuth } from '../context/AuthContext';

const NavBar = ({ onNavigate, currentPage }) => {
    const { logout } = useAuth();

    return (
        <nav className="bg-blue-600 text-white px-6 py-4 shadow">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">
                    Policy Version Diff Viewer
                </h1>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => onNavigate('dashboard')}
                        className={`px-3 py-1 rounded ${
                            currentPage === 'dashboard'
                                ? 'bg-white text-blue-600'
                                : 'text-white hover:text-blue-200'
                        }`}
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => onNavigate('list')}
                        className={`px-3 py-1 rounded ${
                            currentPage === 'list'
                                ? 'bg-white text-blue-600'
                                : 'text-white hover:text-blue-200'
                        }`}
                    >
                        Policies
                    </button>
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-blue-50 font-medium"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;