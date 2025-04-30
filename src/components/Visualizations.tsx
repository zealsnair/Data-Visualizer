import React from 'react';
import { useData } from '../context/DataContext';
import BarChartComponent from './charts/BarChart';
import PieChartComponent from './charts/PieChart';
import ScatterPlotComponent from './charts/ScatterPlot';
import HistogramComponent from './charts/Histogram';
import HeatmapComponent from './charts/Heatmap';
import DataTable from './DataTable';
import { LineChart, Settings, ChevronDown } from 'lucide-react';

const Visualizations: React.FC = () => {
  const { 
    activeChart, 
    headers, 
    selectedColumns, 
    data, 
    stats, 
    columnTypes,
    fileName 
  } = useData();
  
  // Return early if no data
  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-neutral-500">No data available for visualization</p>
      </div>
    );
  }
  
  // Show message if selected columns are not appropriate for the chart type
  const areColumnsValid = () => {
    if (selectedColumns.length === 0) return false;
    
    switch (activeChart) {
      case 'bar':
      case 'scatter':
        return selectedColumns.length >= 2;
      case 'pie':
      case 'histogram':
        return selectedColumns.length >= 1;
      case 'heatmap':
        return selectedColumns.length >= 2;
      default:
        return true;
    }
  };
  
  // Get appropriate title based on active chart and columns
  const getChartTitle = () => {
    if (!areColumnsValid()) return activeChart === 'table' ? 'Data Table' : 'Chart';
    
    switch (activeChart) {
      case 'bar':
        return `Bar Chart: ${selectedColumns[1]} by ${selectedColumns[0]}`;
      case 'pie':
        return `Pie Chart: Distribution of ${selectedColumns[0]}`;
      case 'histogram':
        return `Histogram: Distribution of ${selectedColumns[0]}`;
      case 'scatter':
        return `Scatter Plot: ${selectedColumns[0]} vs ${selectedColumns[1]}`;
      case 'heatmap':
        return `Heatmap: ${selectedColumns[0]} vs ${selectedColumns[1]}`;
      case 'table':
        return 'Data Table';
      default:
        return 'Chart';
    }
  };
  
  // Show a message if the columns are not valid for the selected chart type
  if (!areColumnsValid() && activeChart !== 'table') {
    let message = 'Please select appropriate columns for this chart type.';
    
    switch (activeChart) {
      case 'bar':
        message = 'Please select a category column and a numeric column.';
        break;
      case 'pie':
        message = 'Please select a category column.';
        break;
      case 'histogram':
        message = 'Please select a numeric column.';
        break;
      case 'scatter':
        message = 'Please select two numeric columns.';
        break;
      case 'heatmap':
        message = 'Please select at least two columns.';
        break;
    }
    
    return (
      <div className="flex flex-col justify-center items-center h-64 text-center">
        <LineChart size={48} className="text-neutral-300 mb-4" />
        <p className="text-neutral-600 mb-2">{message}</p>
        <p className="text-neutral-500 text-sm">Use the column selector above to choose suitable columns.</p>
      </div>
    );
  }
  
  // Render the appropriate chart component
  const renderChart = () => {
    switch (activeChart) {
      case 'bar':
        return <BarChartComponent />;
      case 'pie':
        return <PieChartComponent />;
      case 'histogram':
        return <HistogramComponent />;
      case 'scatter':
        return <ScatterPlotComponent />;
      case 'heatmap':
        return <HeatmapComponent />;
      case 'table':
        return <DataTable />;
      default:
        return <div>Select a chart type</div>;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {getChartTitle()}
          {fileName && <span className="text-sm font-normal text-neutral-500 ml-2">({fileName})</span>}
        </h3>
        <div className="flex gap-2">
          <button className="btn btn-outline p-2">
            <Settings size={18} />
          </button>
          <button className="btn btn-outline p-2">
            <ChevronDown size={18} />
          </button>
        </div>
      </div>
      
      <div className="p-2">
        {renderChart()}
      </div>
    </div>
  );
};

export default Visualizations;