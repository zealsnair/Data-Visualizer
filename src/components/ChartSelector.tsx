import React from 'react';
import { useData } from '../context/DataContext';
import { BarChart2, PieChart, ScatterChart, Activity, Grid, Table } from 'lucide-react';
import classNames from 'classnames';

const ChartSelector: React.FC = () => {
  const { activeChart, setActiveChart } = useData();
  
  const chartOptions = [
    { id: 'table', label: 'Table', icon: <Table size={18} /> },
    { id: 'bar', label: 'Bar', icon: <BarChart2 size={18} /> },
    { id: 'pie', label: 'Pie', icon: <PieChart size={18} /> },
    { id: 'histogram', label: 'Histogram', icon: <Activity size={18} /> },
    { id: 'scatter', label: 'Scatter', icon: <ScatterChart size={18} /> },
    { id: 'heatmap', label: 'Heatmap', icon: <Grid size={18} /> },
  ];
  
  return (
    <div>
      <h3 className="text-sm font-medium text-neutral-600 mb-2">Chart Type</h3>
      <div className="flex flex-wrap gap-2">
        {chartOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setActiveChart(option.id)}
            className={classNames(
              'px-3 py-2 rounded-md flex items-center gap-2 text-sm transition-colors',
              {
                'bg-primary-500 text-white': activeChart === option.id,
                'bg-neutral-100 text-neutral-700 hover:bg-neutral-200': activeChart !== option.id,
              }
            )}
          >
            {option.icon}
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChartSelector;