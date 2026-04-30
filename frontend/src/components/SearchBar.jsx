import { useState, useEffect } from 'react';

const SearchBar = ({ onSearch, onStatusChange, onDateChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [status, setStatus] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
        onStatusChange(e.target.value);
    };

    const handleDateChange = () => {
        onDateChange(startDate, endDate);
    };

    const handleClear = () => {
        setSearchTerm('');
        setStatus('');
        setStartDate('');
        setEndDate('');
        onSearch('');
        onStatusChange('');
        onDateChange('', '');
    };

    return (
        <div className="bg-white shadow rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                {/* Search Input */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Search
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by title..."
                            className="w-full border rounded px-3 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="absolute left-3 top-2.5 text-gray-400">
              🔍
            </span>
                    </div>
                </div>

                {/* Status Dropdown */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                    </label>
                    <select
                        value={status}
                        onChange={handleStatusChange}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Status</option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="DRAFT">DRAFT</option>
                        <option value="INACTIVE">INACTIVE</option>
                    </select>
                </div>

                {/* Clear Button */}
                <div className="flex items-end">
                    <button
                        onClick={handleClear}
                        className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-medium"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        From Date
                    </label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        To Date
                    </label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex items-end">
                    <button
                        onClick={handleDateChange}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                    >
                        Apply Date Filter
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;