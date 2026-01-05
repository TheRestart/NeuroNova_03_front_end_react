import React, { useState, useEffect } from 'react';
import { risService, Patient } from '../../services/risService';

interface DicomUploaderProps {
    onUploadSuccess?: () => void;
}

const DicomUploader: React.FC<DicomUploaderProps> = ({ onUploadSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [selectedPatientId, setSelectedPatientId] = useState<string>('');
    const [patients, setPatients] = useState<Patient[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string } | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);

    useEffect(() => {
        loadPatients();
    }, [searchQuery]);

    const loadPatients = async () => {
        try {
            const response = await risService.getPatients(searchQuery);
            if (response.success) {
                setPatients(response.patients);
            }
        } catch (error) {
            console.error('[DicomUploader] Failed to load patients:', error);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.name.endsWith('.dcm') || selectedFile.name.endsWith('.dicom')) {
                setFile(selectedFile);
                setUploadResult(null);
            } else {
                alert('Please select a DICOM file (.dcm or .dicom)');
                e.target.value = '';
            }
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a DICOM file');
            return;
        }

        setUploading(true);
        setUploadResult(null);

        try {
            const response = await risService.uploadDicom(file, selectedPatientId || undefined);

            setUploadResult({
                success: response.success,
                message: response.message || (response.success ? 'Upload successful!' : 'Upload failed')
            });

            if (response.success) {
                // Reset form
                setFile(null);
                setSelectedPatientId('');
                const fileInput = document.getElementById('dicom-file-input') as HTMLInputElement;
                if (fileInput) fileInput.value = '';

                // Callback
                if (onUploadSuccess) {
                    setTimeout(() => {
                        onUploadSuccess();
                    }, 1500);
                }
            }
        } catch (error: any) {
            console.error('[DicomUploader] Upload failed:', error);
            setUploadResult({
                success: false,
                message: error.response?.data?.error || error.message || 'Upload failed'
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            {/* Upload Button */}
            <button
                onClick={() => setShowModal(true)}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
                Upload DICOM
            </button>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Upload DICOM File</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* File Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select DICOM File
                            </label>
                            <input
                                id="dicom-file-input"
                                type="file"
                                accept=".dcm,.dicom"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                            />
                            {file && (
                                <p className="mt-2 text-sm text-gray-500">
                                    Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                                </p>
                            )}
                        </div>

                        {/* Patient Selection */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Assign to Patient (Optional)
                            </label>
                            <input
                                type="text"
                                placeholder="Search patient..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <select
                                value={selectedPatientId}
                                onChange={(e) => setSelectedPatientId(e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">-- No patient selected (use existing DICOM metadata) --</option>
                                {patients.map((patient) => (
                                    <option key={patient.patient_id} value={patient.patient_id}>
                                        {patient.patient_id} - {patient.name} ({patient.birth_date})
                                    </option>
                                ))}
                            </select>
                            {patients.length === 0 && searchQuery && (
                                <p className="mt-2 text-sm text-gray-500">No patients found</p>
                            )}
                        </div>

                        {/* Upload Result */}
                        {uploadResult && (
                            <div
                                className={`mb-4 p-3 rounded ${
                                    uploadResult.success
                                        ? 'bg-green-100 border border-green-400 text-green-700'
                                        : 'bg-red-100 border border-red-400 text-red-700'
                                }`}
                            >
                                <p className="text-sm">{uploadResult.message}</p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                                disabled={uploading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={!file || uploading}
                                className={`px-4 py-2 text-white rounded ${
                                    !file || uploading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-500 hover:bg-blue-600'
                                }`}
                            >
                                {uploading ? 'Uploading...' : 'Upload'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DicomUploader;
