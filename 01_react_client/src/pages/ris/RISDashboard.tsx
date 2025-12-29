import React from 'react';
import { useNavigate } from 'react-router-dom';
import StudyList from '../../components/ris/StudyList';

const RISDashboard: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Radiology Information System (RIS)</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage DICOM studies and view medical images.</p>
                </div>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="text-gray-600 hover:text-gray-900"
                >
                    Back to Main Dashboard
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Statistics Cards (Placeholder) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                        <div className="text-gray-500 text-sm">Total Studies</div>
                        <div className="text-2xl font-bold text-blue-600">-</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                        <div className="text-gray-500 text-sm">Today's Orders</div>
                        <div className="text-2xl font-bold text-green-600">-</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                        <div className="text-gray-500 text-sm">AI Pending</div>
                        <div className="text-2xl font-bold text-orange-600">-</div>
                    </div>
                </div>

                {/* Study List Table */}
                <StudyList />
            </div>
        </div>
    );
};

export default RISDashboard;
