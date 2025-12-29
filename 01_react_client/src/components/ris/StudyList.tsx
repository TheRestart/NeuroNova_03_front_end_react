import React, { useEffect, useState } from 'react';
import { risService, Study } from '../../services/risService';

const StudyList: React.FC = () => {
    const [studies, setStudies] = useState<Study[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const fetchStudies = async (pageArg: number) => {
        setLoading(true);
        try {
            const response = await risService.getStudies(pageArg);
            if (response.success) {
                setStudies(response.data.studies);
                setTotalPages(response.data.total_pages);
            } else {
                setError("Failed to load studies.");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred fetching studies.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudies(page);
    }, [page]);

    const handleOpenViewer = (studyInstanceUid: string) => {
        const viewerUrl = risService.getViewerUrl(studyInstanceUid);
        window.open(viewerUrl, '_blank', 'noopener,noreferrer');
    };

    if (loading) return <div className="p-4 text-center">Loading Studies...</div>;
    if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                    DICOM Studies (PACS)
                </h3>
                <button
                    onClick={() => fetchStudies(page)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                >
                    Refresh
                </button>
            </div>
            <div className="border-t border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modality</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {studies.map((study) => (
                            <tr key={study.study_id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{study.study_date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{study.patient_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{study.modality}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{study.study_description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleOpenViewer(study.study_instance_uid)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        View Images
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {studies.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No studies found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Pagination Controls */}
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-700 self-center">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudyList;
