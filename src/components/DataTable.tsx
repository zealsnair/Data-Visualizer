import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { DataRow } from '../utils/types';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

const DataTable: React.FC = () => {
  const { data, headers } = useData();
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter data based on search term
  const filteredData = data.filter((row) => {
    if (!searchTerm) return true;
    
    return Object.values(row).some((value) => {
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  // Sort filtered data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue === bValue) return 0;
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;
    
    const comparison = aValue > bValue ? 1 : -1;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Get display value for a cell
  const getCellValue = (row: DataRow, field: string) => {
    const value = row[field];
    
    if (value === null || value === undefined) {
      return <span className="text-neutral-400">—</span>;
    }
    
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    return String(value);
  };

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="flex items-center border border-neutral-300 rounded-md px-3 py-2 bg-white">
        <Search size={18} className="text-neutral-400 mr-2" />
        <input
          type="text"
          placeholder="Search data..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="outline-none flex-grow text-sm"
        />
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-neutral-100">
              {headers.map((header) => (
                <th
                  key={header}
                  className="text-left py-2 px-4 font-semibold text-neutral-700 border-b cursor-pointer hover:bg-neutral-200 transition-colors"
                  onClick={() => handleSort(header)}
                >
                  <div className="flex items-center gap-1">
                    <span>{header}</span>
                    {sortField === header && (
                      sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr 
                  key={index}
                  className="border-b border-neutral-200 hover:bg-neutral-50 transition-colors"
                >
                  {headers.map((header) => (
                    <td key={`${index}-${header}`} className="py-2 px-4 text-sm">
                      {getCellValue(row, header)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length} className="text-center py-8 text-neutral-500">
                  {searchTerm ? 'No matching records found' : 'No data available'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-neutral-600">
            Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length} entries
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md text-sm border border-neutral-300 disabled:opacity-50"
            >
              Previous
            </button>
            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
              // Show pages around current page
              let pageNum = i + 1;
              if (totalPages > 5) {
                if (currentPage > 3) {
                  pageNum = i + currentPage - 2;
                }
                if (currentPage > totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                }
              }
              
              if (pageNum <= totalPages) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded-md text-sm border ${
                      currentPage === pageNum
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'border-neutral-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
              return null;
            })}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md text-sm border border-neutral-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;