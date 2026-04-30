import { useState, useEffect } from 'react';
import api from '../services/api';

const FormPage = ({ policyId, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        versionNumber: '',
        status: 'DRAFT',
        content: '',
        createdBy: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (policyId) {
            fetchPolicy();
        }
    }, [policyId]);

    const fetchPolicy = async () => {
        try {
            const response = await api.get(`/api/policy-versions/${policyId}`);
            setFormData(response.data);
        } catch (err) {
            setMessage('Failed to load policy');
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }
        if (!formData.versionNumber.trim()) {
            newErrors.versionNumber = 'Version number is required';
        }
        if (!formData.createdBy.trim()) {
            newErrors.createdBy = 'Created by is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setErrors({
            ...errors,
            [e.target.name]: '',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            setLoading(true);
            if (policyId) {
                await api.put(`/api/policy-versions/${policyId}`, formData);
                setMessage('Policy updated successfully!');
            } else {
                await api.post('/api/policy-versions', formData);
                setMessage('Policy created successfully!');
            }
            if (onSuccess) onSuccess();
        } catch (err) {
            setMessage('Failed to save policy');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {policyId ? 'Edit Policy' : 'Create New Policy'}
            </h2>
            {message && (
                <div className={`p-4 rounded mb-4 ${
                    message.includes('success')
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                }`}>
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit}
                  className="bg-white shadow rounded-lg p-6">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title *
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter policy title"
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Version Number *
                    </label>
                    <input
                        type="text"
                        name="versionNumber"
                        value={formData.versionNumber}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. v1.0"
                    />
                    {errors.versionNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.versionNumber}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status *
                    </label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="DRAFT">DRAFT</option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Created By *
                    </label>
                    <input
                        type="text"
                        name="createdBy"
                        value={formData.createdBy}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your name"
                    />
                    {errors.createdBy && (
                        <p className="text-red-500 text-sm mt-1">{errors.createdBy}</p>
                    )}
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content
                    </label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        rows={4}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter policy content"
                    />
                </div>
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : policyId ? 'Update' : 'Create'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormPage;