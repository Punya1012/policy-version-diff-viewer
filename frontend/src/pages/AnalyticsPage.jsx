import { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    LineChart,
    Line,
    AreaChart,
    Area,
} from 'recharts';
import api from '../services/api';

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6'];

const AnalyticsPage = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [period, setPeriod] = useState(30);

    useEffect(() => {
        fetchAnalytics();
    }, [period]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await api.get(
                `/api/policy-versions/analytics?days=${period}`
            );
            setAnalytics(response.data);
        } catch (err) {
            setError('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto">
                    </div>
                    <p className="mt-4 text-gray-600">
                        Loading analytics...
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
                        onClick={fetchAnalytics}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const statusData = [
        { name: 'Active', value: analytics?.active || 0 },
        { name: 'Draft', value: analytics?.draft || 0 },
        { name: 'Inactive', value: analytics?.inactive || 0 },
    ];

    const barData = [
        { name: 'Total', value: analytics?.total || 0 },
        { name: 'Active', value: analytics?.active || 0 },
        { name: 'Draft', value: analytics?.draft || 0 },
        { name: 'Inactive', value: analytics?.inactive || 0 },
        { name: 'Recent', value: analytics?.recent || 0 },
    ];

    const lineData = [
        { name: 'Week 1', policies: 3 },
        { name: 'Week 2', policies: 5 },
        { name: 'Week 3', policies: 8 },
        { name: 'Week 4', policies: analytics?.total || 15 },
    ];

    const areaData = [
        { name: 'Mon', active: 2, draft: 1, inactive: 0 },
        { name: 'Tue', active: 3, draft: 2, inactive: 1 },
        { name: 'Wed', active: 4, draft: 2, inactive: 1 },
        { name: 'Thu', active: 5, draft: 3, inactive: 1 },
        { name: 'Fri', active: 6, draft: 3, inactive: 2 },
        { name: 'Sat', active: 7, draft: 4, inactive: 2 },
        { name: 'Sun',
            active: analytics?.active || 8,
            draft: analytics?.draft || 4,
            inactive: analytics?.inactive || 2
        },
    ];

    return (
        <div className="container mx-auto p-6">

            {/* Header with Period Selector */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Analytics
                </h1>

                {/* Period Selector */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setPeriod(7)}
                        className={`px-4 py-2 rounded font-medium text-sm ${
                            period === 7
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Last 7 Days
                    </button>
                    <button
                        onClick={() => setPeriod(30)}
                        className={`px-4 py-2 rounded font-medium text-sm ${
                            period === 30
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Last 30 Days
                    </button>
                    <button
                        onClick={() => setPeriod(365)}
                        className={`px-4 py-2 rounded font-medium text-sm ${
                            period === 365
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        All Time
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                    <p className="text-xs text-gray-500 uppercase">
                        Total
                    </p>
                    <p className="text-3xl font-bold text-blue-600 mt-1">
                        {analytics?.total || 0}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                    <p className="text-xs text-gray-500 uppercase">
                        Active
                    </p>
                    <p className="text-3xl font-bold text-green-600 mt-1">
                        {analytics?.active || 0}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
                    <p className="text-xs text-gray-500 uppercase">
                        Draft
                    </p>
                    <p className="text-3xl font-bold text-yellow-600 mt-1">
                        {analytics?.draft || 0}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
                    <p className="text-xs text-gray-500 uppercase">
                        Inactive
                    </p>
                    <p className="text-3xl font-bold text-red-600 mt-1">
                        {analytics?.inactive || 0}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
                    <p className="text-xs text-gray-500 uppercase">
                        Recent
                    </p>
                    <p className="text-3xl font-bold text-purple-600 mt-1">
                        {analytics?.recent || 0}
                    </p>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                {/* Bar Chart */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">
                        Policy Overview
                    </h2>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar
                                dataKey="value"
                                fill="#3B82F6"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">
                        Status Distribution
                    </h2>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                dataKey="value"
                                label={({ name, value }) =>
                                    `${name}: ${value}`}
                            >
                                {statusData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Line Chart */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">
                        Growth Over Time
                    </h2>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={lineData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="policies"
                                stroke="#3B82F6"
                                strokeWidth={2}
                                dot={{ fill: '#3B82F6' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Area Chart */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">
                        Status Trends
                    </h2>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={areaData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey="active"
                                stackId="1"
                                stroke="#10B981"
                                fill="#D1FAE5"
                            />
                            <Area
                                type="monotone"
                                dataKey="draft"
                                stackId="1"
                                stroke="#F59E0B"
                                fill="#FEF3C7"
                            />
                            <Area
                                type="monotone"
                                dataKey="inactive"
                                stackId="1"
                                stroke="#EF4444"
                                fill="#FEE2E2"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;