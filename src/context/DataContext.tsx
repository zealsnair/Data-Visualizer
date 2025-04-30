import React, { createContext, useContext, useState, useEffect } from 'react';
import { DataRow, DataStats, ColumnType, ColumnStats } from '../utils/types';
import { getDataStats, detectColumnTypes } from '../utils/dataAnalysis';

interface DataContextType {
  data: DataRow[];
  setData: React.Dispatch<React.SetStateAction<DataRow[]>>;
  headers: string[];
  stats: DataStats | null;
  columnTypes: Record<string, ColumnType>;
  activeChart: string;
  setActiveChart: React.Dispatch<React.SetStateAction<string>>;
  selectedColumns: string[];
  setSelectedColumns: React.Dispatch<React.SetStateAction<string[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fileName: string;
  setFileName: React.Dispatch<React.SetStateAction<string>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<DataRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [stats, setStats] = useState<DataStats | null>(null);
  const [columnTypes, setColumnTypes] = useState<Record<string, ColumnType>>({});
  const [activeChart, setActiveChart] = useState<string>('table');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');

  // When data changes, update headers, stats, and column types
  useEffect(() => {
    if (data.length > 0) {
      const firstRow = data[0];
      const headers = Object.keys(firstRow);
      setHeaders(headers);
      
      // Auto-select first two columns
      if (headers.length > 0 && selectedColumns.length === 0) {
        setSelectedColumns(headers.slice(0, Math.min(2, headers.length)));
      }

      // Detect column types
      const types = detectColumnTypes(data);
      setColumnTypes(types);

      // Calculate statistics
      const stats = getDataStats(data, types);
      setStats(stats);
    } else {
      setHeaders([]);
      setStats(null);
      setColumnTypes({});
      setSelectedColumns([]);
    }
  }, [data]);

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        headers,
        stats,
        columnTypes,
        activeChart,
        setActiveChart,
        selectedColumns,
        setSelectedColumns,
        isLoading,
        setIsLoading,
        fileName,
        setFileName,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};