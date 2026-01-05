import React from 'react';

interface ResponseTableProps {
    data: any[];
    title?: string;
    columns?: string[];
}

const ResponseTable: React.FC<ResponseTableProps> = ({ data, title, columns }) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return <div className="text-gray-500 text-sm p-4">데이터가 없습니다.</div>;
    }

    // Auto-detect columns from the first keys if not provided
    const tableColumns = columns || Object.keys(data[0]);

    return (
        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm mt-4">
            {title && (
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 font-semibold text-gray-700">
                    {title} <span className="text-xs font-normal text-gray-500 ml-2">({data.length} items)</span>
                </div>
            )}
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {tableColumns.map((col) => (
                            <th
                                key={col}
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                            {tableColumns.map((col) => {
                                const value = row[col];
                                let displayValue = value;

                                if (typeof value === 'object' && value !== null) {
                                    displayValue = JSON.stringify(value);
                                    if (displayValue.length > 50) displayValue = displayValue.substring(0, 50) + '...';
                                } else if (typeof value === 'boolean') {
                                    displayValue = value ? 'TRUE' : 'FALSE';
                                }

                                return (
                                    <td key={`${rowIndex}-${col}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {displayValue}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ResponseTable;
