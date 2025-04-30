import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useData } from '../../context/DataContext';
import { getChartData } from '../../utils/dataAnalysis';

const COLORS = [
  '#3B82F6', // primary-500
  '#14B8A6', // secondary-500 
  '#8B5CF6', // accent-500
  '#F59E0B', // warning-500
  '#22C55E', // success-500
  '#EF4444', // error-500
  '#6366F1', // indigo-500
  '#EC4899', // pink-500
  '#0EA5E9', // sky-500
  '#10B981', // emerald-500
  '#6B7280', // neutral-500
  '#8B5CF6', // purple-500
  '#F97316', // orange-500
  '#84CC16', // lime-500
  '#06B6D4', // cyan-500
];

const PieChartComponent: React.FC = () => {
  const { data, selectedColumns, columnTypes } = useData();
  
  if (selectedColumns.length < 1) {
    return (
      <div className="flex items-center justify-center h-64 text-neutral-500">
        Please select a column
      </div>
    );
  }
  
  const categoryColumn = selectedColumns[0];
  const chartData = getChartData(data, 'pie', [categoryColumn], columnTypes);
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-neutral-200 rounded-md shadow-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-neutral-600">
            Count: <span className="font-medium">{data.value}</span>
          </p>
          <p className="text-neutral-600">
            Percentage:{' '}
            <span className="font-medium">
              {((data.value / chartData.reduce((sum, entry) => sum + entry.value, 0)) * 100).toFixed(1)}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            animationDuration={500}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: 20 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;