import { useState } from 'react';
import ListPage from './pages/ListPage';
import FormPage from './pages/FormPage';
import NavBar from './components/NavBar';

function App() {
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
}

export default App;