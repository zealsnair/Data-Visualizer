import React from 'react';
import { BarChart2, Upload, FileSpreadsheet } from 'lucide-react';

const NoData: React.FC = () => {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-8 flex flex-col items-center justify-center text-center">
      <div className="rounded-full bg-primary-50 p-4 mb-4">
        <BarChart2 size={48} className="text-primary-500" />
      </div>
      <h2 className="text-xl font-semibold mb-2">No Data to Visualize</h2>
      <p className="text-neutral-600 max-w-md mb-6">
        Upload an Excel or CSV file to generate visualizations and insights. Or use our sample data to see how it works.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
        <div className="border border-neutral-200 rounded-lg p-4 text-center hover:border-primary-400 hover:bg-primary-50 transition-colors">
          <Upload size={32} className="text-primary-500 mx-auto mb-2" />
          <h3 className="font-medium mb-1">Upload Your Data</h3>
          <p className="text-sm text-neutral-500">
            Import your Excel or CSV file for analysis
          </p>
        </div>
        <div className="border border-neutral-200 rounded-lg p-4 text-center hover:border-primary-400 hover:bg-primary-50 transition-colors">
          <FileSpreadsheet size={32} className="text-primary-500 mx-auto mb-2" />
          <h3 className="font-medium mb-1">Use Sample Data</h3>
          <p className="text-sm text-neutral-500">
            Try it out with pre-generated sample data
          </p>
        </div>
      </div>
      
      <div className="mt-8 border-t border-neutral-200 pt-4 w-full max-w-lg">
        <h3 className="text-sm font-medium mb-2">Supported Features</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <div className="bg-neutral-50 p-2 rounded">Bar Charts</div>
          <div className="bg-neutral-50 p-2 rounded">Pie Charts</div>
          <div className="bg-neutral-50 p-2 rounded">Histograms</div>
          <div className="bg-neutral-50 p-2 rounded">Scatter Plots</div>
          <div className="bg-neutral-50 p-2 rounded">Heatmaps</div>
          <div className="bg-neutral-50 p-2 rounded">Data Insights</div>
        </div>
      </div>
    </div>
  );
};

export default NoData;