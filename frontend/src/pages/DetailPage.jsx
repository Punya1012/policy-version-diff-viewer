import { useState, useEffect } from 'react';
import api from '../services/api';
import AiPanel from '../components/AiPanel';

const DetailPage = ({ policyId, onEdit, onBack }) => {
    const [policy, setPolicy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPolicy();
    }, [policyId]);

    const fetchPolicy = async () => {
        try {
            setLoading(true);
            const response = await api.get(
                `/api/policy-versions/${policyId}`
            );
            setPolicy(response.data);
        } catch (err) {
            setError('Failed to load policy details');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete?')) {
            try {
                await api.delete(`/api/policy-versions/${policyId}`);
                onBack();
            } catch (err) {
                alert('Failed to delete policy');
            }
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            ACTIVE: 'bg-green-100 text-green-800 border border-green-300',
            DRAFT: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
            INACTIVE: 'bg-red-100 text-red-800 border border-red-300',
        };
        return styles[status] || 'bg-gray-100 text-gray-800';
    };

    const getScoreBadge = (status) => {
        const scores = {
            ACTIVE: { score: 'A', color: 'bg-green-500' },
            DRAFT: { score: 'B', color: 'bg-yellow-500' },
            INACTIVE: { score: 'C', color: 'bg-red-500' },
        };
        return scores[status] ||
            { score: 'N/A', color: 'bg-gray-500' };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto">
                    </div>
                    <p className="mt-4 text-gray-600">
                        Loading policy details...
                    </p>
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
                        onClick={onBack}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const scoreBadge = getScoreBadge(policy.status);

    return (
        <div className="container mx-auto p-6 max-w-3xl">

            {/* Back button */}
            <button
                onClick={onBack}
                className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
            >
                ← Back to List
            </button>

            {/* Main Policy Card */}
            <div className="bg-white shadow rounded-lg overflow-hidden">

                {/* Header */}
                <div className="p-6 border-b flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {policy.title}
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Version: {policy.versionNumber}
                        </p>
                    </div>

                    {/* Score Badge */}
                    <div className={`${scoreBadge.color} text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold shadow`}>
                        {scoreBadge.score}
                    </div>
                </div>

                {/* Details */}
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-6 mb-6">

                        <div>
                            <p className="text-sm text-gray-500 font-medium">
                                Status
                            </p>
                            <span className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(policy.status)}`}>
                {policy.status}
              </span>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 font-medium">
                                Created By
                            </p>
                            <p className="mt-1 text-gray-800 font-medium">
                                {policy.createdBy}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 font-medium">
                                Created At
                            </p>
                            <p className="mt-1 text-gray-800">
                                {policy.createdAt
                                    ? new Date(policy.createdAt)
                                        .toLocaleDateString()
                                    : 'N/A'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 font-medium">
                                Last Updated
                            </p>
                            <p className="mt-1 text-gray-800">
                                {policy.updatedAt
                                    ? new Date(policy.updatedAt)
                                        .toLocaleDateString()
                                    : 'N/A'}
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    {policy.content && (
                        <div className="mb-6">
                            <p className="text-sm text-gray-500 font-medium mb-2">
                                Content
                            </p>
                            <div className="bg-gray-50 rounded p-4 text-gray-700">
                                {policy.content}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4 border-t">
                        <button
                            onClick={() => onEdit(policy.id)}
                            className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 font-medium"
                        >
                            Edit Policy
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-medium"
                        >
                            Delete Policy
                        </button>
                        <button
                            onClick={onBack}
                            className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>

            {/* AI Panel — below main card */}
            <AiPanel
                policyId={policyId}
                policyTitle={policy.title}
            />

        </div>
    );
};

export default DetailPage;