import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import FileUploader from './FileUploader';
import DataTable from './DataTable';
import Visualizations from './Visualizations';
import InsightsPanel from './InsightsPanel';
import NoData from './NoData';
import ColumnSelector from './ColumnSelector';
import ChartSelector from './ChartSelector';
import { Loader, AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { data, isLoading, activeChart } = useData();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Main heading */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800">Data Insights</h1>
          <p className="text-neutral-600 mt-1">Upload, analyze, and visualize your data</p>
        </div>
        <FileUploader setError={setError} />
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-error-50 border border-error-500 text-error-700 px-4 py-3 rounded-md flex items-center gap-2">
          <AlertTriangle size={20} />
          <span>{error}</span>
          <button 
            className="ml-auto text-error-700 hover:text-error-500"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <Loader size={32} className="animate-spin text-primary-500" />
            <p className="text-neutral-600">Processing your data...</p>
          </div>
        </div>
      )}

      {/* No data state */}
      {!isLoading && data.length === 0 && (
        <NoData />
      )}

      {/* Data content */}
      {!isLoading && data.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main content */}
          <div className="lg:col-span-9 space-y-6">
            {/* Chart controls */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white p-4 rounded-lg border border-neutral-200">
              <ChartSelector />
              <ColumnSelector />
            </div>

            {/* Visualization area */}
            <div className="card p-4">
              <Visualizations />
            </div>

            {/* Data table (when table view is active) */}
            {activeChart === 'table' && (
              <div className="card p-4">
                <h3 className="text-lg font-semibold mb-3">Data Table</h3>
                <DataTable />
              </div>
            )}
          </div>

          {/* Insights panel */}
          <div className="lg:col-span-3">
            <InsightsPanel />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;