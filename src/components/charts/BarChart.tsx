import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useData } from '../../context/DataContext';
import { getChartData } from '../../utils/dataAnalysis';

const COLORS = [
  '#3B82F6', // primary-500
  '#14B8A6', // secondary-500
  '#8B5CF6', // accent-500
  '#F59E0B', // warning-500
  '#22C55E', // success-500
];

const BarChartComponent: React.FC = () => {
  const { data, selectedColumns, columnTypes } = useData();
  
  if (selectedColumns.length < 2) {
    return (
      <div className="flex items-center justify-center h-64 text-neutral-500">
        Please select at least two columns
      </div>
    );
  }
  
  const [categoryColumn, valueColumn] = selectedColumns;
  const chartData = getChartData(data, 'bar', [categoryColumn, valueColumn], columnTypes);
  
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={{ stroke: '#E5E7EB' }}
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis 
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={{ stroke: '#E5E7EB' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '4px',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Legend wrapperStyle={{ marginTop: 10 }} />
          <Bar
            dataKey="value"
            name={valueColumn}
            fill={COLORS[0]}
            radius={[4, 4, 0, 0]}
            animationDuration={500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;