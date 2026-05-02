import { useState, useEffect } from 'react';
import api from '../services/api';
import SearchBar from '../components/SearchBar';

const ListPage = ({ onCreateNew, onEdit, onViewDetail }) => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const pageSize = 5;

    useEffect(() => {
        fetchPolicies();
    }, [currentPage, searchTerm, statusFilter]);

    const fetchPolicies = async () => {
        try {
            setLoading(true);
            let response;
            if (searchTerm) {
                response = await api.get(
                    `/api/policy-versions/search?q=${searchTerm}`
                );
                let data = response.data;
                if (statusFilter) {
                    data = data.filter(
                        p => p.status === statusFilter
                    );
                }
                setPolicies(data);
                setTotalPages(1);
            } else {
                response = await api.get(
                    `/api/policy-versions?page=${currentPage}&size=${pageSize}`
                );
                if (response.data.content) {
                    let data = response.data.content;
                    if (statusFilter) {
                        data = data.filter(
                            p => p.status === statusFilter
                        );
                    }
                    setPolicies(data);
                    setTotalPages(response.data.totalPages);
                } else {
                    let data = response.data;
                    if (statusFilter) {
                        data = data.filter(
                            p => p.status === statusFilter
                        );
                    }
                    setPolicies(data);
                }
            }
        } catch (err) {
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await api.delete(`/api/policy-versions/${id}`);
                fetchPolicies();
            } catch (err) {
                alert('Failed to delete policy');
            }
        }
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(0);
    };

    const handleStatusChange = (status) => {
        setStatusFilter(status);
        setCurrentPage(0);
    };

    const handleDateChange = (start, end) => {
        setCurrentPage(0);
    };

    const handleExportCsv = async () => {
        try {
            const response = await api.get(
                '/api/policy-versions/export',
                { responseType: 'blob' }
            );
            const url = window.URL.createObjectURL(
                new Blob([response.data])
            );
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'policies.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert('Failed to export CSV');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto">
                    </div>
                    <p className="mt-4 text-gray-600">
                        Loading policies...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center text-red-500">
                    <p className="text-xl">{error}</p>
                    <button
                        onClick={fetchPolicies}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6">

            {/* Header — responsive */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                    Policy Versions
                </h1>
                <div className="flex gap-2 w-full md:w-auto">
                    <button
                        onClick={handleExportCsv}
                        className="flex-1 md:flex-none px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
                    >
                        📥 Export CSV
                    </button>
                    <button
                        onClick={onCreateNew}
                        className="flex-1 md:flex-none px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                    >
                        + Add Policy
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <SearchBar
                onSearch={handleSearch}
                onStatusChange={handleStatusChange}
                onDateChange={handleDateChange}
            />

            {/* Empty State */}
            {policies.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-xl text-gray-500">
                        No policies found
                    </p>
                    <p className="text-gray-400 mt-2 text-sm">
                        Try different search terms or clear filters
                    </p>
                    <button
                        onClick={onCreateNew}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        + Add New Policy
                    </button>
                </div>
            ) : (
                <>
                    {/* Table — scrollable on mobile */}
                    <div className="bg-white shadow rounded-lg overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    ID
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Title
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">
                                    Version
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">
                                    Created By
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {policies.map((policy) => (
                                <tr
                                    key={policy.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3 text-sm text-gray-900">
                                        {policy.id}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                                        {policy.title}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900 hidden md:table-cell">
                                        {policy.versionNumber}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          policy.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800'
                              : policy.status === 'DRAFT'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                      }`}>
                        {policy.status}
                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900 hidden md:table-cell">
                                        {policy.createdBy}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <div className="flex gap-1 flex-wrap">
                                            <button
                                                onClick={() =>
                                                    onViewDetail(policy.id)}
                                                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() =>
                                                    onEdit(policy.id)}
                                                className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(policy.id)}
                                                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-6 gap-2 flex-wrap">
                            <button
                                onClick={() =>
                                    setCurrentPage(p => Math.max(0, p - 1))}
                                disabled={currentPage === 0}
                                className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 text-sm"
                            >
                                Previous
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i)}
                                    className={`px-3 py-2 rounded text-sm ${
                                        currentPage === i
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() =>
                                    setCurrentPage(p =>
                                        Math.min(totalPages - 1, p + 1))}
                                disabled={currentPage === totalPages - 1}
                                className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 text-sm"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ListPage;