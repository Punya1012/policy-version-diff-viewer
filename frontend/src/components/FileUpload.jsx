import { useState } from 'react';
import api from '../services/api';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setMessage('');
        setError('');
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file first');
            return;
        }

        const allowedTypes = [
            'application/pdf',
            'text/plain',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        if (!allowedTypes.includes(file.type)) {
            setError('Only PDF, TXT and DOC files are allowed');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB');
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post(
                '/api/policy-versions/upload',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            setMessage(
                `✅ ${response.data.message} — ${response.data.filename}`
            );
            setFile(null);
            document.getElementById('fileInput').value = '';
        } catch (err) {
            setError('Failed to upload file');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
                📎 Upload Policy Document
            </h2>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <p className="text-gray-500 mb-2 text-sm">
                    Allowed: PDF, TXT, DOC files — Max size: 5MB
                </p>
                <input
                    id="fileInput"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.txt,.doc,.docx"
                    className="mb-4"
                />

                {file && (
                    <div className="mb-4 p-3 bg-blue-50 rounded text-sm text-blue-700">
                        Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </div>
                )}

                <button
                    onClick={handleUpload}
                    disabled={loading || !file}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Uploading...' : '⬆️ Upload File'}
                </button>
            </div>

            {message && (
                <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
                    {message}
                </div>
            )}

            {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}
        </div>
    );
};

export default FileUpload;