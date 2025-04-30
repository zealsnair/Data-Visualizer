import React from 'react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ZAxis
} from 'recharts';
import { useData } from '../../context/DataContext';
import { getChartData } from '../../utils/dataAnalysis';

const ScatterPlotComponent: React.FC = () => {
  const { data, selectedColumns, columnTypes } = useData();
  
  if (selectedColumns.length < 2) {
    return (
      <div className="flex items-center justify-center h-64 text-neutral-500">
        Please select two columns
      </div>
    );
  }
  
  const [xColumn, yColumn] = selectedColumns;
  const chartData = getChartData(data, 'scatter', [xColumn, yColumn], columnTypes);
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-neutral-200 rounded-md shadow-md">
          <p className="text-neutral-600">
            {xColumn}: <span className="font-medium">{data.x}</span>
          </p>
          <p className="text-neutral-600">
            {yColumn}: <span className="font-medium">{data.y}</span>
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="x" 
            type="number" 
            name={xColumn}
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={{ stroke: '#E5E7EB' }}
            label={{ value: xColumn, position: 'insideBottom', offset: -10, fill: '#6B7280' }}
          />
          <YAxis 
            dataKey="y" 
            type="number" 
            name={yColumn}
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={{ stroke: '#E5E7EB' }}
            label={{ value: yColumn, angle: -90, position: 'insideLeft', offset: -5, fill: '#6B7280' }}
          />
          <ZAxis range={[60, 60]} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
          <Scatter 
            name="Data Points" 
            data={chartData} 
            fill="#3B82F6"
            animationDuration={500}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScatterPlotComponent;