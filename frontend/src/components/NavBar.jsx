const NavBar = () => {
    return (
        <nav className="bg-blue-600 text-white px-6 py-4 shadow">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">
                    Policy Version Diff Viewer
                </h1>
                <div className="flex gap-4">
                    <a href="/" className="hover:text-blue-200">
                        Home
                    </a>
                    <a href="/list" className="hover:text-blue-200">
                        Policies
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;