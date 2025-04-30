import React from 'react';
import { useData } from '../context/DataContext';
import { Check, ChevronDown } from 'lucide-react';
import classNames from 'classnames';

const ColumnSelector: React.FC = () => {
  const { 
    headers, 
    columnTypes, 
    selectedColumns, 
    setSelectedColumns,
    activeChart
  } = useData();
  
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  
  // Different chart types need different column types and quantities
  const getRequiredColumnInfo = () => {
    switch (activeChart) {
      case 'bar':
        return {
          maxColumns: 2,
          label: 'Category and Value Columns',
          description: 'Select a category column and a numeric column'
        };
      case 'pie':
        return {
          maxColumns: 1,
          label: 'Category Column',
          description: 'Select a categorical column'
        };
      case 'histogram':
        return {
          maxColumns: 1,
          label: 'Numeric Column',
          description: 'Select a numeric column'
        };
      case 'scatter':
        return {
          maxColumns: 2,
          label: 'X and Y Axes',
          description: 'Select two numeric columns'
        };
      case 'heatmap':
        return {
          maxColumns: 2,
          label: 'Row and Column',
          description: 'Select two columns for the heatmap axes'
        };
      case 'table':
        return {
          maxColumns: headers.length,
          label: 'Columns',
          description: 'All columns are displayed in the table'
        };
      default:
        return {
          maxColumns: 2,
          label: 'Columns',
          description: 'Select columns for the chart'
        };
    }
  };
  
  const { maxColumns, label, description } = getRequiredColumnInfo();
  
  const toggleColumn = (column: string) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter(c => c !== column));
    } else {
      if (selectedColumns.length < maxColumns) {
        setSelectedColumns([...selectedColumns, column]);
      } else {
        // Replace the last selected column
        const newSelected = [...selectedColumns];
        newSelected[maxColumns - 1] = column;
        setSelectedColumns(newSelected);
      }
    }
  };
  
  // Get appropriate style based on column type
  const getColumnTypeStyle = (column: string) => {
    const type = columnTypes[column];
    switch (type) {
      case 'numeric':
        return 'bg-green-100 text-green-800';
      case 'categorical':
        return 'bg-blue-100 text-blue-800';
      case 'boolean':
        return 'bg-yellow-100 text-yellow-800';
      case 'date':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get text for column type
  const getColumnTypeText = (column: string) => {
    const type = columnTypes[column];
    switch (type) {
      case 'numeric':
        return 'Numeric';
      case 'categorical':
        return 'Category';
      case 'boolean':
        return 'Boolean';
      case 'date':
        return 'Date';
      default:
        return 'Unknown';
    }
  };
  
  return (
    <div className="relative">
      <h3 className="text-sm font-medium text-neutral-600 mb-2">{label}</h3>
      <div className="flex flex-wrap gap-2 items-center">
        {selectedColumns.length > 0 ? (
          selectedColumns.map((column, index) => (
            <div 
              key={column}
              className="flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-md text-sm"
            >
              <span className="font-medium">{column}</span>
              <span className="text-xs opacity-70">({index === 0 ? 'X' : 'Y'})</span>
              <button
                onClick={() => toggleColumn(column)}
                className="ml-1 text-primary-700 hover:text-primary-900"
              >
                ×
              </button>
            </div>
          ))
        ) : (
          <div className="text-neutral-500 text-sm">{description}</div>
        )}
        
        {activeChart !== 'table' && (
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="btn btn-outline p-2"
          >
            <ChevronDown size={16} />
          </button>
        )}
      </div>
      
      {/* Dropdown for column selection */}
      {dropdownOpen && (
        <div className="absolute z-10 mt-2 w-64 bg-white border border-neutral-200 rounded-md shadow-lg p-2 max-h-80 overflow-y-auto right-0">
          <div className="text-xs font-medium text-neutral-500 mb-2 px-2">Select Columns</div>
          {headers.map((column) => (
            <div 
              key={column}
              onClick={() => toggleColumn(column)}
              className="flex items-center justify-between px-2 py-2 hover:bg-neutral-50 rounded cursor-pointer text-sm"
            >
              <div className="flex items-center gap-2">
                <div className={classNames(
                  'w-4 h-4 flex items-center justify-center rounded-sm border', 
                  selectedColumns.includes(column) 
                    ? 'bg-primary-500 border-primary-500' 
                    : 'border-neutral-300'
                )}>
                  {selectedColumns.includes(column) && (
                    <Check size={12} className="text-white" />
                  )}
                </div>
                <span>{column}</span>
              </div>
              <span className={classNames(
                'text-xs px-1.5 py-0.5 rounded-full', 
                getColumnTypeStyle(column)
              )}>
                {getColumnTypeText(column)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColumnSelector;