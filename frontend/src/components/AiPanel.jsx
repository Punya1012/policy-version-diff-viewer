import { useState } from 'react';
import api from '../services/api';

const AiPanel = ({ policyId, policyTitle }) => {
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('describe');
    const [describeResult, setDescribeResult] = useState(null);
    const [recommendResult, setRecommendResult] = useState(null);
    const [reportResult, setReportResult] = useState(null);
    const [error, setError] = useState(null);

    const handleDescribe = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.post('/ai/describe', {
                policy_id: policyId,
                title: policyTitle,
            });
            setDescribeResult(response.data);
        } catch (err) {
            setDescribeResult({
                description: `This is an AI-generated description for "${policyTitle}". This policy outlines the key guidelines and procedures that must be followed by all stakeholders.`,
                generated_at: new Date().toISOString(),
                is_fallback: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRecommend = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.post('/ai/recommend', {
                policy_id: policyId,
                title: policyTitle,
            });
            setRecommendResult(response.data);
        } catch (err) {
            setRecommendResult({
                recommendations: [
                    {
                        action_type: 'REVIEW',
                        description: 'Schedule a quarterly review of this policy',
                        priority: 'HIGH',
                    },
                    {
                        action_type: 'UPDATE',
                        description: 'Update the policy to reflect recent changes',
                        priority: 'MEDIUM',
                    },
                    {
                        action_type: 'NOTIFY',
                        description: 'Notify all stakeholders of policy changes',
                        priority: 'LOW',
                    },
                ],
                is_fallback: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleReport = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.post('/ai/generate-report', {
                policy_id: policyId,
                title: policyTitle,
            });
            setReportResult(response.data);
        } catch (err) {
            setReportResult({
                title: `Policy Report — ${policyTitle}`,
                summary: 'This report provides an overview of the policy.',
                overview: 'The policy has been reviewed and analyzed.',
                key_items: [
                    'Policy is currently in draft status',
                    'Requires review before activation',
                    'All stakeholders must be notified',
                ],
                recommendations: [
                    'Complete the review process',
                    'Update policy content',
                    'Get approval from management',
                ],
                is_fallback: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const getPriorityColor = (priority) => {
        const colors = {
            HIGH: 'bg-red-100 text-red-800',
            MEDIUM: 'bg-yellow-100 text-yellow-800',
            LOW: 'bg-green-100 text-green-800',
        };
        return colors[priority] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="bg-white shadow rounded-lg p-6 mt-6">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🤖</span>
                <h2 className="text-lg font-semibold text-gray-700">
                    AI Assistant
                </h2>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
          Powered by AI
        </span>
            </div>

            {/* Tab Buttons */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setActiveTab('describe')}
                    className={`px-4 py-2 rounded font-medium text-sm ${
                        activeTab === 'describe'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    📝 Describe
                </button>
                <button
                    onClick={() => setActiveTab('recommend')}
                    className={`px-4 py-2 rounded font-medium text-sm ${
                        activeTab === 'recommend'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    💡 Recommend
                </button>
                <button
                    onClick={() => setActiveTab('report')}
                    className={`px-4 py-2 rounded font-medium text-sm ${
                        activeTab === 'report'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    📊 Report
                </button>
            </div>

            {/* Describe Tab */}
            {activeTab === 'describe' && (
                <div>
                    <p className="text-sm text-gray-500 mb-3">
                        Get an AI-generated description of this policy
                    </p>
                    <button
                        onClick={handleDescribe}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 mb-4"
                    >
                        {loading ? '🤔 Thinking...' : '✨ Generate Description'}
                    </button>

                    {/* Loading Spinner */}
                    {loading && (
                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <p className="text-blue-600 text-sm">
                                AI is analyzing the policy...
                            </p>
                        </div>
                    )}

                    {/* Result Card */}
                    {describeResult && !loading && (
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-medium text-blue-800">
                                    AI Description
                                </h3>
                                {describeResult.is_fallback && (
                                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                    Demo Mode
                  </span>
                                )}
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">
                                {describeResult.description}
                            </p>
                            {describeResult.generated_at && (
                                <p className="text-xs text-gray-400 mt-2">
                                    Generated at: {new Date(
                                    describeResult.generated_at
                                ).toLocaleString()}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Recommend Tab */}
            {activeTab === 'recommend' && (
                <div>
                    <p className="text-sm text-gray-500 mb-3">
                        Get AI recommendations for this policy
                    </p>
                    <button
                        onClick={handleRecommend}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 mb-4"
                    >
                        {loading ? '🤔 Thinking...' : '💡 Get Recommendations'}
                    </button>

                    {/* Loading Spinner */}
                    {loading && (
                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <p className="text-blue-600 text-sm">
                                AI is generating recommendations...
                            </p>
                        </div>
                    )}

                    {/* Result Card */}
                    {recommendResult && !loading && (
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium text-gray-700">
                                    AI Recommendations
                                </h3>
                                {recommendResult.is_fallback && (
                                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                    Demo Mode
                  </span>
                                )}
                            </div>
                            {recommendResult.recommendations?.map((rec, index) => (
                                <div
                                    key={index}
                                    className="p-4 bg-gray-50 rounded-lg border"
                                >
                                    <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-800 text-sm">
                      {rec.action_type}
                    </span>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(rec.priority)}`}>
                      {rec.priority}
                    </span>
                                    </div>
                                    <p className="text-gray-600 text-sm">
                                        {rec.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Report Tab */}
            {activeTab === 'report' && (
                <div>
                    <p className="text-sm text-gray-500 mb-3">
                        Generate a full AI report for this policy
                    </p>
                    <button
                        onClick={handleReport}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 mb-4"
                    >
                        {loading ? '🤔 Thinking...' : '📊 Generate Report'}
                    </button>

                    {/* Loading Spinner */}
                    {loading && (
                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <p className="text-blue-600 text-sm">
                                AI is generating report...
                            </p>
                        </div>
                    )}

                    {/* Result Card */}
                    {reportResult && !loading && (
                        <div className="p-4 bg-gray-50 rounded-lg border">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-semibold text-gray-800">
                                    {reportResult.title}
                                </h3>
                                {reportResult.is_fallback && (
                                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                    Demo Mode
                  </span>
                                )}
                            </div>
                            <div className="mb-3">
                                <p className="text-sm font-medium text-gray-600 mb-1">
                                    Summary
                                </p>
                                <p className="text-sm text-gray-700">
                                    {reportResult.summary}
                                </p>
                            </div>
                            <div className="mb-3">
                                <p className="text-sm font-medium text-gray-600 mb-1">
                                    Overview
                                </p>
                                <p className="text-sm text-gray-700">
                                    {reportResult.overview}
                                </p>
                            </div>
                            {reportResult.key_items && (
                                <div className="mb-3">
                                    <p className="text-sm font-medium text-gray-600 mb-1">
                                        Key Items
                                    </p>
                                    <ul className="list-disc list-inside space-y-1">
                                        {reportResult.key_items.map((item, i) => (
                                            <li key={i} className="text-sm text-gray-700">
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {reportResult.recommendations && (
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">
                                        Recommendations
                                    </p>
                                    <ul className="list-disc list-inside space-y-1">
                                        {reportResult.recommendations.map((rec, i) => (
                                            <li key={i} className="text-sm text-gray-700">
                                                {rec}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AiPanel;