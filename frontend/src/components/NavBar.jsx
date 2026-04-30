import { useAuth } from '../context/AuthContext';

const NavBar = () => {
    const { logout, isAuthenticated } = useAuth();

    return (
        <nav className="bg-blue-600 text-white px-6 py-4 shadow">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">
                    Policy Version Diff Viewer
                </h1>
                {isAuthenticated && (
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-blue-50 font-medium"
                    >
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
};

export default NavBar;