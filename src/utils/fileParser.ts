import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { DataRow } from './types';

// Parse CSV file
export const parseCSV = (file: File): Promise<DataRow[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data as DataRow[]);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

// Parse Excel file
export const parseExcel = (file: File): Promise<DataRow[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData as DataRow[]);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

// Parse file based on extension
export const parseFile = async (file: File): Promise<DataRow[]> => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (!extension) {
    throw new Error('Invalid file extension');
  }
  
  if (extension === 'csv') {
    return parseCSV(file);
  } else if (['xlsx', 'xls'].includes(extension)) {
    return parseExcel(file);
  } else {
    throw new Error('Unsupported file format. Please upload a CSV or Excel file.');
  }
};

// Generate sample data for testing
export const generateSampleData = (): DataRow[] => {
  const sampleData: DataRow[] = [];
  const categories = ['Category A', 'Category B', 'Category C', 'Category D'];
  const regions = ['North', 'South', 'East', 'West'];
  
  for (let i = 0; i < 100; i++) {
    sampleData.push({
      id: i + 1,
      category: categories[Math.floor(Math.random() * categories.length)],
      region: regions[Math.floor(Math.random() * regions.length)],
      value: Math.round(Math.random() * 1000),
      price: +(Math.random() * 100 + 10).toFixed(2),
      quantity: Math.floor(Math.random() *
      20) + 1,
      date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      inStock: Math.random() > 0.3,
    });
  }
  
  return sampleData;
};