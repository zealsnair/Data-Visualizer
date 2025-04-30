import React from 'react';
import { useData } from '../context/DataContext';
import { generateInsights } from '../utils/dataAnalysis';
import { Lightbulb, AlertTriangle, Info, CheckCircle } from 'lucide-react';

const InsightsPanel: React.FC = () => {
  const { stats, data, headers, columnTypes } = useData();
  
  if (data.length === 0) {
    return null;
  }
  
  const insights = stats ? generateInsights(stats) : [];
  
  // Get icon for the insight type
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={20} className="text-warning-500 shrink-0" />;
      case 'info':
        return <Info size={20} className="text-primary-500 shrink-0" />;
      case 'success':
        return <CheckCircle size={20} className="text-success-500 shrink-0" />;
      case 'error':
        return <AlertTriangle size={20} className="text-error-500 shrink-0" />;
      default:
        return <Info size={20} className="text-primary-500 shrink-0" />;
    }
  };
  
  // Get color class for the insight type
  const getInsightColorClass = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-warning-300 bg-warning-50';
      case 'info':
        return 'border-primary-300 bg-primary-50';
      case 'success':
        return 'border-success-300 bg-success-50';
      case 'error':
        return 'border-error-300 bg-error-50';
      default:
        return 'border-neutral-300 bg-neutral-50';
    }
  };
  
  return (
    <div className="card p-4 sticky top-4">
      <div className="flex items-center mb-4 gap-2">
        <Lightbulb size={20} className="text-accent-500" />
        <h3 className="text-lg font-semibold">Insights</h3>
      </div>
      
      {/* Data summary */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-neutral-700 mb-2">Dataset Summary</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-neutral-100 rounded">
            <span className="text-neutral-500">Rows</span>
            <div className="font-medium">{data.length}</div>
          </div>
          <div className="p-2 bg-neutral-100 rounded">
            <span className="text-neutral-500">Columns</span>
            <div className="font-medium">{headers.length}</div>
          </div>
        </div>
      </div>
      
      {/* Column types summary */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-neutral-700 mb-2">Column Types</h4>
        <div className="space-y-2 text-sm">
          {Object.entries(columnTypes).length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-neutral-100 rounded">
                <span className="text-neutral-500">Numeric</span>
                <div className="font-medium">
                  {Object.values(columnTypes).filter(type => type === 'numeric').length}
                </div>
              </div>
              <div className="p-2 bg-neutral-100 rounded">
                <span className="text-neutral-500">Categorical</span>
                <div className="font-medium">
                  {Object.values(columnTypes).filter(type => type === 'categorical').length}
                </div>
              </div>
              <div className="p-2 bg-neutral-100 rounded">
                <span className="text-neutral-500">Boolean</span>
                <div className="font-medium">
                  {Object.values(columnTypes).filter(type => type === 'boolean').length}
                </div>
              </div>
              <div className="p-2 bg-neutral-100 rounded">
                <span className="text-neutral-500">Date</span>
                <div className="font-medium">
                  {Object.values(columnTypes).filter(type => type === 'date').length}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-neutral-500">No column type information available</p>
          )}
        </div>
      </div>
      
      {/* Generated insights */}
      <div>
        <h4 className="text-sm font-medium text-neutral-700 mb-2">Data Insights</h4>
        <div className="space-y-3">
          {insights.length > 0 ? (
            insights.map((insight, index) => (
              <div
                key={index}
                className={`p-3 rounded border ${getInsightColorClass(insight.type)}`}
              >
                <div className="flex gap-2 items-start">
                  {getInsightIcon(insight.type)}
                  <div>
                    <h5 className="text-sm font-medium">{insight.title}</h5>
                    <p className="text-xs text-neutral-600 mt-1">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-neutral-500 text-sm">No insights available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;