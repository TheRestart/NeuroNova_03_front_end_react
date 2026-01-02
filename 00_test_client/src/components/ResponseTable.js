import React, { useState, useMemo } from 'react';

/**
 * ResponseTable 컴포넌트
 *
 * 목적: API 응답 데이터를 가독성 높은 테이블로 시각화
 * 기능:
 *  - JSON 객체/배열 자동 감지
 *  - 배열 -> 데이터 그리드 (정렬, 필터링, Pagination) -> ArrayTable 컴포넌트 분리
 *  - 단일 객체 -> Key-Value 테이블
 *  - 중첩 객체 지원 (JSON.stringify)
 *
 * 작성일: 2026-01-02
 * 수정일: 2026-01-02 (Refactored to fix Hooks violation)
 */

// 스타일 (컴포넌트 하단에 정의됨)
const styles = {
  container: {
    marginTop: '20px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    padding: '20px',
  },
  title: {
    marginTop: 0,
    marginBottom: '15px',
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    borderBottom: '2px solid #1976d2',
    paddingBottom: '10px',
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  controlBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 15px',
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #e0e0e0',
    flexWrap: 'wrap',
    gap: '10px',
  },
  searchBox: {
    flex: '1 1 200px',
  },
  searchInput: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  pageInfo: {
    fontSize: '14px',
    color: '#666',
    fontWeight: '500',
  },
  pageSizeSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
  },
  select: {
    padding: '6px 10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  tableWrapper: {
    overflowX: 'auto',
    maxHeight: '500px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '12px 15px',
    textAlign: 'left',
    backgroundColor: '#1976d2',
    color: '#fff',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    userSelect: 'none',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    whiteSpace: 'nowrap',
  },
  thSorted: {
    backgroundColor: '#1565c0',
  },
  sortIcon: {
    marginLeft: '5px',
    fontSize: '12px',
  },
  tr: {
    borderBottom: '1px solid #e0e0e0',
  },
  td: {
    padding: '10px 15px',
    fontSize: '13px',
    color: '#333',
    wordBreak: 'break-word',
  },
  keyCell: {
    fontWeight: '600',
    backgroundColor: '#f5f5f5',
    color: '#1976d2',
  },
  nullValue: {
    color: '#999',
    fontStyle: 'italic',
  },
  trueValue: {
    color: '#4caf50',
    fontWeight: '600',
  },
  falseValue: {
    color: '#f44336',
    fontWeight: '600',
  },
  jsonCode: {
    display: 'block',
    backgroundColor: '#f5f5f5',
    padding: '8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontFamily: 'monospace',
    maxWidth: '300px',
    overflow: 'auto',
  },
  jsonPre: {
    backgroundColor: '#f5f5f5',
    padding: '10px',
    borderRadius: '4px',
    fontSize: '12px',
    fontFamily: 'monospace',
    maxWidth: '600px',
    overflow: 'auto',
    margin: 0,
  },
  emptyState: {
    padding: '40px',
    textAlign: 'center',
    color: '#999',
    fontSize: '14px',
  },
  primitiveContainer: {
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '4px',
  },
  primitiveValue: {
    margin: 0,
    fontSize: '14px',
    fontFamily: 'monospace',
    color: '#333',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '15px',
    gap: '10px',
    borderTop: '1px solid #e0e0e0',
  },
  paginationButton: {
    padding: '6px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
  },
  pageIndicator: {
    margin: '0 10px',
    fontSize: '14px',
    fontWeight: '500',
  },
};

// 1. ArrayTable 컴포넌트 분리 (Hooks 규칙 준수)
const ArrayTable = ({ data }) => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 컬럼 추출 (첫 번째 아이템의 키)
  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  // 정렬 처리
  const sortedData = useMemo(() => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection]);

  // 검색 필터링
  const filteredData = useMemo(() => {
    if (!searchTerm) return sortedData;

    return sortedData.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [sortedData, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  // 정렬 토글
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // 값 렌더링 (중첩 객체 처리)
  const renderCellValue = (value) => {
    if (value === null || value === undefined) {
      return <span style={styles.nullValue}>null</span>;
    }
    if (typeof value === 'object') {
      return <code style={styles.jsonCode}>{JSON.stringify(value, null, 2)}</code>;
    }
    if (typeof value === 'boolean') {
      return <span style={value ? styles.trueValue : styles.falseValue}>{String(value)}</span>;
    }
    return String(value);
  };

  if (!data || data.length === 0) {
    return <div style={styles.emptyState}>데이터가 없습니다.</div>;
  }

  return (
    <div style={styles.tableContainer}>
      {/* 컨트롤 바 */}
      <div style={styles.controlBar}>
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="검색..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // 검색 시 첫 페이지로 이동
            }}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.pageInfo}>
          총 {filteredData.length}건
        </div>

        <div style={styles.pageSizeSelector}>
          <label>페이지 크기: </label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            style={styles.select}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* 테이블 */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              {columns.map(column => (
                <th
                  key={column}
                  onClick={() => handleSort(column)}
                  style={{
                    ...styles.th,
                    ...(sortColumn === column ? styles.thSorted : {})
                  }}
                >
                  {column}
                  {sortColumn === column && (
                    <span style={styles.sortIcon}>
                      {sortDirection === 'asc' ? ' ▲' : ' ▼'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex} style={styles.tr}>
                {columns.map(column => (
                  <td key={column} style={styles.td}>
                    {renderCellValue(row[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            style={styles.paginationButton}
          >
            처음
          </button>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            style={styles.paginationButton}
          >
            이전
          </button>

          <span style={styles.pageIndicator}>
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={styles.paginationButton}
          >
            다음
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            style={styles.paginationButton}
          >
            마지막
          </button>
        </div>
      )}
    </div>
  );
};

// 2. 메인 컴포넌트
const ResponseTable = ({ data, title = "API 응답 데이터" }) => {
  // 데이터 타입 감지
  const isArray = Array.isArray(data);
  const isObject = data && typeof data === 'object' && !Array.isArray(data);

  // 단일 객체 처리 (Key-Value 테이블) - 상태가 없으므로 일반 함수나 컴포넌트 둘 다 가능하나, 단순 렌더링이므로 함수 유지 가능.
  // 하지만 일관성을 위해 내부 컴포넌트 혹은 렌더 함수로 둡니다. 상태를 쓰지 않으므로 Hook 위반 없음.
  const renderObjectTable = () => {
    const entries = Object.entries(data);

    if (entries.length === 0) {
      return <div style={styles.emptyState}>데이터가 없습니다.</div>;
    }

    const renderValue = (value) => {
      if (value === null || value === undefined) {
        return <span style={styles.nullValue}>null</span>;
      }
      if (typeof value === 'object') {
        return <pre style={styles.jsonPre}>{JSON.stringify(value, null, 2)}</pre>;
      }
      if (typeof value === 'boolean') {
        return <span style={value ? styles.trueValue : styles.falseValue}>{String(value)}</span>;
      }
      return String(value);
    };

    return (
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>필드명</th>
              <th style={styles.th}>값</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([key, value]) => (
              <tr key={key} style={styles.tr}>
                <td style={{ ...styles.td, ...styles.keyCell }}>{key}</td>
                <td style={styles.td}>{renderValue(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Primitive 타입 처리
  const renderPrimitive = () => {
    return (
      <div style={styles.primitiveContainer}>
        <pre style={styles.primitiveValue}>{String(data)}</pre>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>{title}</h3>
      {/* 3. 함수 호출이 아닌 컴포넌트 렌더링 방식으로 변경 */}
      {isArray && <ArrayTable data={data} />}
      {isObject && renderObjectTable()}
      {!isArray && !isObject && renderPrimitive()}
    </div>
  );
};

export default ResponseTable;
