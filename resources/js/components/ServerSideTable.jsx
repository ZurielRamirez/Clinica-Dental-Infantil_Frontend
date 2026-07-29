import React, { useState, useEffect, useCallback } from 'react';
import '../../css/datatable.css';

const ServerSideTable = ({
  columns,
  fetchUrl,
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
  
  // Estado de Paginación desde la API de Laravel
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 10
  });

  // Debounce para retrasar la petición mientras el usuario escribe en la búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Función principal para consultar la API
  const fetchData = useCallback(async () => {
    if (!fetchUrl) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const token = localStorage.getItem('token');
      
      const queryParams = new URLSearchParams({
        page: pagination.currentPage,
        search: debouncedSearch,
        filter: filterValue
      });

      const response = await fetch(`${fetchUrl}?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      // Validar si la respuesta es explícitamente JSON antes de consumir el body
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error(`El servidor no respondió JSON (Status ${response.status}). Respuesta:`, text.slice(0, 150));
        throw new Error(`Respuesta no válida del servidor (${response.status}). Verifica el endpoint: ${fetchUrl}`);
      }

      const result = await response.json();

      if (response.ok) {
        // Manejo flexible de respuesta Laravel (Paginada o Lista simple)
        const items = result.data ? result.data : (Array.isArray(result) ? result : []);
        setData(items);

        // Estructura de Paginador de Laravel
        if (result.current_page || (result.meta && result.meta.current_page)) {
          setPagination({
            currentPage: result.current_page || result.meta.current_page,
            lastPage: result.last_page || result.meta.last_page,
            total: result.total || result.meta.total,
            perPage: result.per_page || result.meta.per_page
          });
        } else {
          setPagination({
            currentPage: 1,
            lastPage: 1,
            total: items.length,
            perPage: items.length || 10
          });
        }
      } else {
        throw new Error(result.message || `Error ${response.status}: No se pudieron obtener los datos.`);
      }
    } catch (error) {
      console.error('Error al obtener datos paginados:', error);
      setErrorMessage(error.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [fetchUrl, pagination.currentPage, debouncedSearch, filterValue]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="table-wrapper">
      {/* Barra Superior: Filtros y Búsqueda */}
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
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Cuerpo de la Tabla */}
      <div className="overflow-x-auto">
        <table className="custom-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx}>{col.header}</th>
              ))}
              {renderActions && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (renderActions ? 1 : 0)} className="text-center py-8 text-emerald-800 font-medium">
                  ⏳ Cargando datos desde el servidor...
                </td>
              </tr>
            ) : errorMessage ? (
              <tr>
                <td colSpan={columns.length + (renderActions ? 1 : 0)} className="text-center py-8 text-red-600 bg-red-50 font-medium">
                  ⚠️ {errorMessage}
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (renderActions ? 1 : 0)} className="text-center py-8 text-gray-500">
                  No se encontraron resultados para los filtros aplicados.
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr key={row.id || rowIdx}>
                  {columns.map((col, colIdx) => (
                    <td key={colIdx}>
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                  {renderActions && <td>{renderActions(row)}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer de Paginación Server-Side */}
      <div className="table-pagination-footer">
        <span className="page-indicator">
          Mostrando página <strong>{pagination.currentPage}</strong> de <strong>{pagination.lastPage}</strong> ({pagination.total} registros totales)
        </span>

        <div className="flex gap-2">
          <button
            className="pagination-btn"
            disabled={pagination.currentPage <= 1 || loading}
            onClick={() => setPagination((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }))}
          >
            ◀ Anterior
          </button>
          <button
            className="pagination-btn"
            disabled={pagination.currentPage >= pagination.lastPage || loading}
            onClick={() => setPagination((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }))}
          >
            Siguiente ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServerSideTable;