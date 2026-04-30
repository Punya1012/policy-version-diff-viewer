import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import ListPage from './pages/ListPage';
import FormPage from './pages/FormPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DetailPage from './pages/DetailPage';
import NavBar from './components/NavBar';

const AppContent = () => {
    const { isAuthenticated, login } = useAuth();
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [editId, setEditId] = useState(null);
    const [detailId, setDetailId] = useState(null);

    const goToCreate = () => {
        setEditId(null);
        setCurrentPage('form');
    };

    const goToEdit = (id) => {
        setEditId(id);
        setCurrentPage('form');
    };

    const goToDetail = (id) => {
        setDetailId(id);
        setCurrentPage('detail');
    };

    const goToList = () => {
        setCurrentPage('list');
    };

    const handleNavigate = (page) => {
        setCurrentPage(page);
    };

    if (!isAuthenticated) {
        return <LoginPage onLogin={login} />;
    }

    return (
        <div>
            <NavBar
                onNavigate={handleNavigate}
                currentPage={currentPage}
            />
            {currentPage === 'dashboard' && (
                <DashboardPage />
            )}
            {currentPage === 'list' && (
                <ListPage
                    onCreateNew={goToCreate}
                    onEdit={goToEdit}
                    onViewDetail={goToDetail}
                />
            )}
            {currentPage === 'form' && (
                <FormPage
                    policyId={editId}
                    onSuccess={goToList}
                    onCancel={goToList}
                />
            )}
            {currentPage === 'detail' && (
                <DetailPage
                    policyId={detailId}
                    onEdit={goToEdit}
                    onBack={goToList}
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