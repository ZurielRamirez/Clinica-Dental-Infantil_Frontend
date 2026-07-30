import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import '../../css/datatable.css';

const ServerSideTable = ({
  columns,
  endpoint,
  filterOptions = [],
  placeholderSearch = "Buscar...",
  renderActions
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 10
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchData = useCallback(async () => {
    if (!endpoint) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const params = { page: pagination.currentPage };
      if (debouncedSearch) params.search = debouncedSearch;
      if (filterValue) params.filter = filterValue;

      const response = await api.get(endpoint, { params });
      const result = response.data;

      const items = result.data ? result.data : (Array.isArray(result) ? result : []);
      setData(items);

      if (result.meta) {
        setPagination({
          currentPage: result.meta.current_page,
          lastPage: result.meta.last_page,
          total: result.meta.total,
          perPage: result.meta.per_page
        });
      } else if (result.current_page) {
        setPagination({
          currentPage: result.current_page,
          lastPage: result.last_page,
          total: result.total,
          perPage: result.per_page
        });
      } else {
        setPagination({ currentPage: 1, lastPage: 1, total: items.length, perPage: items.length || 10 });
      }
    } catch (error) {
      console.error('Error al obtener datos paginados:', error);
      setErrorMessage(error.response?.data?.message || 'Error al conectar con el servidor.');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint, pagination.currentPage, debouncedSearch, filterValue]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="table-wrapper">
      <div className="table-filter-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder={placeholderSearch}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filterOptions.length > 0 && (
          <div>
            <select
              value={filterValue}
              onChange={(e) => {
                setFilterValue(e.target.value);
                setPagination((prev) => ({ ...prev, currentPage: 1 }));
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-emerald-800"
            >
              <option value="">Todos los registros</option>
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="custom-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (<th key={idx}>{col.header}</th>))}
              {renderActions && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={columns.length + (renderActions ? 1 : 0)} className="text-center py-8 text-emerald-800 font-medium">⏳ Cargando datos desde el servidor...</td></tr>
            ) : errorMessage ? (
              <tr><td colSpan={columns.length + (renderActions ? 1 : 0)} className="text-center py-8 text-red-600 bg-red-50 font-medium">⚠️ {errorMessage}</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={columns.length + (renderActions ? 1 : 0)} className="text-center py-8 text-gray-500">No se encontraron resultados para los filtros aplicados.</td></tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr key={row.id || rowIdx}>
                  {columns.map((col, colIdx) => (
                    <td key={colIdx}>{col.cell ? col.cell(row) : row[col.accessorKey]}</td>
                  ))}
                  {renderActions && <td>{renderActions(row)}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="table-pagination-footer">
        <span className="page-indicator">
          Mostrando página <strong>{pagination.currentPage}</strong> de <strong>{pagination.lastPage}</strong> ({pagination.total} registros totales)
        </span>
        <div className="flex gap-2">
          <button className="pagination-btn" disabled={pagination.currentPage <= 1 || loading} onClick={() => setPagination((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }))}>◀ Anterior</button>
          <button className="pagination-btn" disabled={pagination.currentPage >= pagination.lastPage || loading} onClick={() => setPagination((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }))}>Siguiente ▶</button>
        </div>
      </div>
    </div>
  );
};

export default ServerSideTable;