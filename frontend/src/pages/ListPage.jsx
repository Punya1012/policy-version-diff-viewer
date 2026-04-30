import { useState, useEffect } from 'react';
import api from '../services/api';

const ListPage = ({ onCreateNew, onEdit }) => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/policy-versions');
            setPolicies(response.data);
        } catch (err) {
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this policy?')) {
            try {
                await api.delete(`/api/policy-versions/${id}`);
                fetchPolicies();
            } catch (err) {
                alert('Failed to delete policy');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto">
                    </div>
                    <p className="mt-4 text-gray-600">Loading policies...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center text-red-500">
                    <p className="text-xl">{error}</p>
                    <button
                        onClick={fetchPolicies}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (policies.length === 0) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Policy Versions
                    </h1>
                    <button
                        onClick={onCreateNew}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        + Add New Policy
                    </button>
                </div>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <p className="text-xl text-gray-500">No policies found</p>
                        <p className="text-gray-400 mt-2">
                            Create your first policy to get started
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Policy Versions
                </h1>
                <button
                    onClick={onCreateNew}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    + Add New Policy
                </button>
            </div>
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Version
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Created By
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {policies.map((policy) => (
                        <tr key={policy.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">
                                {policy.id}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                                {policy.title}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                                {policy.versionNumber}
                            </td>
                            <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${policy.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : policy.status === 'DRAFT'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                  }`}>
                    {policy.status}
                  </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                                {policy.createdBy}
                            </td>
                            <td className="px-6 py-4 text-sm">
                                <button
                                    onClick={() => onEdit(policy.id)}
                                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(policy.id)}
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListPage;