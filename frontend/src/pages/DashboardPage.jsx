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
    Legend
} from 'recharts';
import api from '../services/api';

const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

const DashboardPage = () => {
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        draft: 0,
        inactive: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await api.get(
                '/api/policy-versions/stats'
            );
            setStats(response.data);
        } catch (err) {
            setError('Failed to load stats');
        } finally {
            setLoading(false);
        }
    };

    const barData = [
        { name: 'Total', value: stats.total },
        { name: 'Active', value: stats.active },
        { name: 'Draft', value: stats.draft },
        { name: 'Inactive', value: stats.inactive },
    ];

    const pieData = [
        { name: 'Active', value: stats.active },
        { name: 'Draft', value: stats.draft },
        { name: 'Inactive', value: stats.inactive },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto">
                    </div>
                    <p className="mt-4 text-gray-600">
                        Loading dashboard...
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
                        onClick={fetchStats}
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
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
                Dashboard
            </h1>

            {/* KPI Cards — responsive grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                    <p className="text-xs text-gray-500 uppercase font-medium">
                        Total
                    </p>
                    <p className="text-3xl font-bold text-blue-600 mt-1">
                        {stats.total}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        All versions
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                    <p className="text-xs text-gray-500 uppercase font-medium">
                        Active
                    </p>
                    <p className="text-3xl font-bold text-green-600 mt-1">
                        {stats.active}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        Currently active
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
                    <p className="text-xs text-gray-500 uppercase font-medium">
                        Draft
                    </p>
                    <p className="text-3xl font-bold text-yellow-600 mt-1">
                        {stats.draft}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        In progress
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
                    <p className="text-xs text-gray-500 uppercase font-medium">
                        Inactive
                    </p>
                    <p className="text-3xl font-bold text-red-600 mt-1">
                        {stats.inactive}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        Deactivated
                    </p>
                </div>
            </div>

            {/* Charts — stack on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-4 md:p-6">
                    <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-4">
                        Policy Overview
                    </h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar
                                dataKey="value"
                                fill="#3B82F6"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-lg shadow p-4 md:p-6">
                    <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-4">
                        Status Distribution
                    </h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                dataKey="value"
                                label={({ name, value }) =>
                                    `${name}: ${value}`}
                            >
                                {pieData.map((entry, index) => (
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
        </div>
    );
};

export default DashboardPage;