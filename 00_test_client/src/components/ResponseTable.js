import React, { useState, useMemo } from 'react';

/**
 * ResponseTable 컴포넌트
 *
 * 목적: API 응답 데이터를 가독성 높은 테이블로 시각화
 * 기능:
 *  - JSON 객체/배열 자동 감지
 *  - 배열 -> 데이터 그리드 (정렬, 필터링, Pagination) -> ArrayTable 컴포넌트 분리
 *  - 단일 객체 -> Key-Value 테이블 -> ObjectTable 컴포넌트 분리
 *  - 중첩 객체 지원 (JSON.stringify)
 *
 * 수정일: 2026-01-02 (Full Refactoring to eliminate Hook violations and standardise components)
 */

const styles = {
  container: { marginTop: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#f9f9f9', padding: '20px' },
  title: { marginTop: 0, marginBottom: '15px', fontSize: '18px', fontWeight: '600', color: '#333', borderBottom: '2px solid #6366f1', paddingBottom: '10px' },
  tableContainer: { backgroundColor: '#fff', borderRadius: '4px', overflow: 'hidden' },
  controlBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0', flexWrap: 'wrap', gap: '10px' },
  searchBox: { flex: '1 1 200px' },
  searchInput: { width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' },
  pageInfo: { fontSize: '14px', color: '#666', fontWeight: '500' },
  pageSizeSelector: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' },
  select: { padding: '6px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' },
  tableWrapper: { overflowX: 'auto', maxHeight: '500px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px 15px', textAlign: 'left', backgroundColor: '#6366f1', color: '#fff', fontWeight: '600', fontSize: '14px', cursor: 'pointer', userSelect: 'none', position: 'sticky', top: 0, zIndex: 10, whiteSpace: 'nowrap' },
  thSorted: { backgroundColor: '#4f46e5' },
  sortIcon: { marginLeft: '5px', fontSize: '12px' },
  tr: { borderBottom: '1px solid #e0e0e0' },
  td: { padding: '10px 15px', fontSize: '13px', color: '#333', wordBreak: 'break-word' },
  keyCell: { fontWeight: '600', backgroundColor: '#f9fafb', color: '#6366f1' },
  nullValue: { color: '#999', fontStyle: 'italic' },
  trueValue: { color: '#22c55e', fontWeight: '600' },
  falseValue: { color: '#ef4444', fontWeight: '600' },
  jsonCode: { display: 'block', backgroundColor: '#f8fafc', padding: '8px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace', maxWidth: '300px', overflow: 'auto' },
  jsonPre: { backgroundColor: '#f8fafc', padding: '10px', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace', maxWidth: '100%', overflow: 'auto', margin: 0 },
  emptyState: { padding: '40px', textAlign: 'center', color: '#999', fontSize: '14px' },
  primitiveContainer: { padding: '15px', backgroundColor: '#fff', borderRadius: '4px' },
  primitiveValue: { margin: 0, fontSize: '14px', fontFamily: 'monospace', color: '#333' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '15px', gap: '10px', borderTop: '1px solid #e0e0e0' },
  paginationButton: { padding: '6px 12px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s' },
  pageIndicator: { margin: '0 10px', fontSize: '14px', fontWeight: '500' },
};

// 1. ArrayTable 컴포넌트
const ArrayTable = ({ data }) => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  const sortedData = useMemo(() => {
    if (!sortColumn) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      return (aVal < bVal ? -1 : 1) * (sortDirection === 'asc' ? 1 : -1);
    });
  }, [data, sortColumn, sortDirection]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return sortedData;
    return sortedData.filter(row =>
      Object.values(row).some(v => String(v).toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [sortedData, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  const handleSort = (col) => {
    if (sortColumn === col) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(col);
      setSortDirection('asc');
    }
  };

  const renderVal = (v) => {
    if (v === null || v === undefined) return <span style={styles.nullValue}>null</span>;
    if (typeof v === 'object') return <code style={styles.jsonCode}>{JSON.stringify(v, null, 2)}</code>;
    if (typeof v === 'boolean') return <span style={v ? styles.trueValue : styles.falseValue}>{String(v)}</span>;
    return String(v);
  };

  if (!data || data.length === 0) return <div style={styles.emptyState}>데이터가 없습니다.</div>;

  return (
    <div style={styles.tableContainer}>
      <div style={styles.controlBar}>
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="검색..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            style={styles.searchInput}
          />
        </div>
        <div style={styles.pageInfo}>총 {filteredData.length}건</div>
        <div style={styles.pageSizeSelector}>
          <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }} style={styles.select}>
            {[5, 10, 20, 50].map(size => <option key={size} value={size}>{size}</option>)}
          </select>
        </div>
      </div>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col} onClick={() => handleSort(col)} style={{ ...styles.th, ...(sortColumn === col ? styles.thSorted : {}) }}>
                  {col} {sortColumn === col && (sortDirection === 'asc' ? '▲' : '▼')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, idx) => (
              <tr key={idx} style={styles.tr}>
                {columns.map(col => <td key={col} style={styles.td}>{renderVal(row[col])}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} style={styles.paginationButton}>처음</button>
          <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} style={styles.paginationButton}>이전</button>
          <span style={styles.pageIndicator}>{currentPage} / {totalPages}</span>
          <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} style={styles.paginationButton}>다음</button>
          <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} style={styles.paginationButton}>마지막</button>
        </div>
      )}
    </div>
  );
};

// 2. ObjectTable 컴포넌트
const ObjectTable = ({ data }) => {
  const entries = Object.entries(data);
  if (entries.length === 0) return <div style={styles.emptyState}>데이터가 없습니다.</div>;

  const renderVal = (v) => {
    if (v === null || v === undefined) return <span style={styles.nullValue}>null</span>;
    if (typeof v === 'object') return <pre style={styles.jsonPre}>{JSON.stringify(v, null, 2)}</pre>;
    if (typeof v === 'boolean') return <span style={v ? styles.trueValue : styles.falseValue}>{String(v)}</span>;
    return String(v);
  };

  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr><th style={styles.th}>필드명</th><th style={styles.th}>값</th></tr>
        </thead>
        <tbody>
          {entries.map(([k, v]) => (
            <tr key={k} style={styles.tr}>
              <td style={{ ...styles.td, ...styles.keyCell }}>{k}</td>
              <td style={styles.td}>{renderVal(v) || " "}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// 3. 메인 ResponseTable 컴포넌트
const ResponseTable = ({ data, title = "API 응답 데이터" }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const isArray = Array.isArray(data);
  const isObject = data && typeof data === 'object' && !isArray;

  // P-030 Fix: 클립보드 복사 기능
  const handleCopyToClipboard = () => {
    const jsonString = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(jsonString)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000); // 2초 후 메시지 사라짐
      })
      .catch((err) => {
        console.error('클립보드 복사 실패:', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = jsonString;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
          console.error('Fallback 복사 실패:', err);
        }
        document.body.removeChild(textArea);
      });
  };

  return (
    <div style={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ ...styles.title, marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>{title}</h3>
        {/* P-030 Fix: Copy to Clipboard 버튼 */}
        <button
          onClick={handleCopyToClipboard}
          style={{
            padding: '6px 12px',
            background: copySuccess ? '#22c55e' : '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
          onMouseEnter={(e) => !copySuccess && (e.currentTarget.style.background = '#4f46e5')}
          onMouseLeave={(e) => !copySuccess && (e.currentTarget.style.background = '#6366f1')}
        >
          {copySuccess ? '✓ 복사됨!' : '📋 JSON 복사'}
        </button>
      </div>
      <div style={{ borderBottom: '2px solid #6366f1', marginBottom: '15px' }}></div>
      {isArray && <ArrayTable data={data} />}
      {isObject && <ObjectTable data={data} />}
      {!isArray && !isObject && (
        <div style={styles.primitiveContainer}>
          <pre style={styles.primitiveValue}>{String(data)}</pre>
        </div>
      )}
    </div>
  );
};

export default ResponseTable;
