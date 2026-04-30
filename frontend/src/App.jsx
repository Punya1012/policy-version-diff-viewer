import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import ListPage from './pages/ListPage';
import FormPage from './pages/FormPage';
import LoginPage from './pages/LoginPage';
import NavBar from './components/NavBar';

const AppContent = () => {
    const { isAuthenticated, login } = useAuth();
    const [currentPage, setCurrentPage] = useState('list');
    const [editId, setEditId] = useState(null);

    const goToCreate = () => {
        setEditId(null);
        setCurrentPage('form');
    };

    const goToEdit = (id) => {
        setEditId(id);
        setCurrentPage('form');
    };

    const goToList = () => {
        setCurrentPage('list');
    };

    if (!isAuthenticated) {
        return <LoginPage onLogin={login} />;
    }

    return (
        <div>
            <NavBar />
            {currentPage === 'list' && (
                <ListPage
                    onCreateNew={goToCreate}
                    onEdit={goToEdit}
                />
            )}
            {currentPage === 'form' && (
                <FormPage
                    policyId={editId}
                    onSuccess={goToList}
                    onCancel={goToList}
                />
            )}
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;