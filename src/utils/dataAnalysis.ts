import { DataRow, ColumnType, ColumnStats, DataStats, InsightType } from './types';

export const detectColumnTypes = (data: DataRow[]): Record<string, ColumnType> => {
  if (data.length === 0) return {};
  
  const columnTypes: Record<string, ColumnType> = {};
  const headers = Object.keys(data[0]);
  
  headers.forEach(header => {
    // Get a sample of values (up to 100)
    const sampleSize = Math.min(data.length, 100);
    const samples = data.slice(0, sampleSize).map(row => row[header]).filter(val => val !== null && val !== undefined);
    
    if (samples.length === 0) {
      columnTypes[header] = 'unknown';
      return;
    }
    
    // Check if all values are numeric
    const areAllNumeric = samples.every(val => !isNaN(Number(val)) && val !== '');
    if (areAllNumeric) {
      columnTypes[header] = 'numeric';
      return;
    }
    
    // Check if all values are boolean
    const areAllBoolean = samples.every(val => 
      val === true || val === false || val === 'true' || val === 'false' || val === 0 || val === 1
    );
    if (areAllBoolean) {
      columnTypes[header] = 'boolean';
      return;
    }
    
    // Check if all values might be dates
    const mightBeDates = samples.every(val => !isNaN(Date.parse(String(val))));
    if (mightBeDates) {
      columnTypes[header] = 'date';
      return;
    }
    
    // Default to categorical
    columnTypes[header] = 'categorical';
  });
  
  return columnTypes;
};

export const getDataStats = (data: DataRow[], columnTypes: Record<string, ColumnType>): DataStats => {
  if (data.length === 0) {
    return {
      rowCount: 0,
      columnCount: 0,
      columnStats: {}
    };
  }
  
  const headers = Object.keys(data[0]);
  const columnStats: Record<string, ColumnStats> = {};
  
  headers.forEach(header => {
    const values = data.map(row => row[header]);
    const nonNullValues = values.filter(val => val !== null && val !== undefined && val !== '');
    
    const stats: ColumnStats = {
      type: columnTypes[header] || 'unknown',
      count: values.length,
      missing: values.length - nonNullValues.length,
    };
    
    if (stats.type === 'numeric') {
      const numericValues = nonNullValues.map(v => Number(v));
      stats.min = Math.min(...numericValues);
      stats.max = Math.max(...numericValues);
      stats.mean = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
      
      // Calculate median
      const sorted = [...numericValues].sort((a, b) => a - b);
      const middle = Math.floor(sorted.length / 2);
      stats.median = sorted.length % 2 === 0 
        ? (sorted[middle - 1] + sorted[middle]) / 2 
        : sorted[middle];
      
      // Calculate standard deviation
      const variance = numericValues.reduce((a, b) => a + Math.pow(b - stats.mean!, 2), 0) / numericValues.length;
      stats.std = Math.sqrt(variance);
    } else if (stats.type === 'categorical' || stats.type === 'boolean') {
      // Calculate frequencies
      const frequencies: Record<string, number> = {};
      nonNullValues.forEach(val => {
        const key = String(val);
        frequencies[key] = (frequencies[key] || 0) + 1;
      });
      stats.frequencies = frequencies;
      stats.uniqueCount = Object.keys(frequencies).length;
    } else if (stats.type === 'date') {
      const dateValues = nonNullValues.map(v => new Date(v));
      stats.minDate = new Date(Math.min(...dateValues.map(d => d.getTime())));
      stats.maxDate = new Date(Math.max(...dateValues.map(d => d.getTime())));
    }
    
    columnStats[header] = stats;
  });
  
  return {
    rowCount: data.length,
    columnCount: headers.length,
    columnStats
  };
};

export const generateInsights = (stats: DataStats): InsightType[] => {
  const insights: InsightType[] = [];
  
  if (!stats) return insights;
  
  // Check data completeness
  const columns = Object.keys(stats.columnStats);
  const columnsWithMissingData = columns.filter(col => 
    stats.columnStats[col].missing > 0
  );
  
  if (columnsWithMissingData.length > 0) {
    insights.push({
      type: 'warning',
      title: 'Missing Data Detected',
      description: `${columnsWithMissingData.length} column(s) have missing values which may affect analysis.`
    });
  }
  
  // Check for numeric columns with potential outliers
  columns.forEach(col => {
    const colStats = stats.columnStats[col];
    if (colStats.type === 'numeric' && colStats.std !== undefined && colStats.mean !== undefined) {
      // Simple outlier detection using standard deviation
      const zScoreThreshold = 3;
      const range = colStats.max! - colStats.min!;
      
      if (colStats.std / colStats.mean > 0.5 && range / colStats.mean > 2) {
        insights.push({
          type: 'info',
          title: `Potential Outliers in "${col}"`,
          description: `High variance detected which may indicate outliers.`
        });
      }
    }
  });
  
  // Check for skewed distributions in numeric columns
  columns.forEach(col => {
    const colStats = stats.columnStats[col];
    if (colStats.type === 'numeric' && colStats.mean !== undefined && colStats.median !== undefined) {
      const skewness = Math.abs(colStats.mean - colStats.median) / (colStats.std || 1);
      if (skewness > 0.5) {
        insights.push({
          type: 'info',
          title: `Skewed Distribution in "${col}"`,
          description: `The data in this column appears to be ${colStats.mean > colStats.median ? 'right' : 'left'}-skewed.`
        });
      }
    }
  });
  
  // Check for categorical columns with many unique values
  columns.forEach(col => {
    const colStats = stats.columnStats[col];
    if (colStats.type === 'categorical' && colStats.uniqueCount !== undefined) {
      if (colStats.uniqueCount > 20 && colStats.uniqueCount / stats.rowCount > 0.5) {
        insights.push({
          type: 'info',
          title: `High Cardinality in "${col}"`,
          description: `This column has ${colStats.uniqueCount} unique values which may be better treated as an identifier than a category.`
        });
      }
    }
  });
  
  // Add general insight about the dataset
  insights.push({
    type: 'success',
    title: 'Dataset Overview',
    description: `Dataset contains ${stats.rowCount} rows and ${stats.columnCount} columns.`
  });
  
  return insights;
};

// Helper function to get data for specific chart types
export const getChartData = (
  data: DataRow[], 
  chartType: string, 
  columns: string[], 
  columnTypes: Record<string, ColumnType>
) => {
  if (data.length === 0 || columns.length === 0) return [];
  
  switch (chartType) {
    case 'bar':
      return prepareBarChartData(data, columns[0], columns[1], columnTypes);
    case 'pie':
      return preparePieChartData(data, columns[0], columnTypes);
    case 'histogram':
      return prepareHistogramData(data, columns[0], columnTypes);
    case 'scatter':
      return prepareScatterData(data, columns[0], columns[1], columnTypes);
    case 'heatmap':
      return prepareHeatmapData(data, columns, columnTypes);
    default:
      return data;
  }
};

const prepareBarChartData = (
  data: DataRow[], 
  categoryColumn: string, 
  valueColumn: string,
  columnTypes: Record<string, ColumnType>
) => {
  // For bar charts, we need a category and a value
  if (!categoryColumn || !valueColumn) return [];
  
  // Group by category column
  const grouped: Record<string, number> = {};
  
  data.forEach(row => {
    const category = String(row[categoryColumn] || 'Unknown');
    const value = columnTypes[valueColumn] === 'numeric' ? Number(row[valueColumn] || 0) : 1;
    
    grouped[category] = (grouped[category] || 0) + value;
  });
  
  // Convert to array and limit to top 20 categories if there are too many
  let result = Object.entries(grouped).map(([name, value]) => ({ name, value }));
  
  if (result.length > 20) {
    result.sort((a, b) => b.value - a.value);
    result = result.slice(0, 20);
  }
  
  return result;
};

const preparePieChartData = (
  data: DataRow[], 
  categoryColumn: string,
  columnTypes: Record<string, ColumnType>
) => {
  // For pie charts, we need a category
  if (!categoryColumn) return [];
  
  // Count occurrences of each category
  const counts: Record<string, number> = {};
  
  data.forEach(row => {
    const category = String(row[categoryColumn] || 'Unknown');
    counts[category] = (counts[category] || 0) + 1;
  });
  
  // Convert to array and limit to top 10 categories
  let result = Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  
  if (result.length > 10) {
    const topValues = result.slice(0, 9);
    const otherValue = result.slice(9).reduce((sum, item) => sum + item.value, 0);
    
    result = [
      ...topValues,
      { name: 'Other', value: otherValue }
    ];
  }
  
  return result;
};

const prepareHistogramData = (
  data: DataRow[], 
  numericColumn: string,
  columnTypes: Record<string, ColumnType>
) => {
  // For histograms, we need a numeric column
  if (!numericColumn || columnTypes[numericColumn] !== 'numeric') return [];
  
  const values = data
    .map(row => Number(row[numericColumn]))
    .filter(val => !isNaN(val));
  
  if (values.length === 0) return [];
  
  // Calculate bins
  const min = Math.min(...values);
  const max = Math.max(...values);
  const binCount = Math.min(20, Math.ceil(Math.sqrt(values.length)));
  const binWidth = (max - min) / binCount;
  
  const bins: Record<string, number> = {};
  
  values.forEach(val => {
    const binIndex = Math.min(binCount - 1, Math.floor((val - min) / binWidth));
    const binStart = min + binIndex * binWidth;
    const binEnd = binStart + binWidth;
    const binKey = `${binStart.toFixed(2)}-${binEnd.toFixed(2)}`;
    
    bins[binKey] = (bins[binKey] || 0) + 1;
  });
  
  return Object.entries(bins).map(([name, value]) => ({ name, value }));
};

const prepareScatterData = (
  data: DataRow[], 
  xColumn: string, 
  yColumn: string,
  columnTypes: Record<string, ColumnType>
) => {
  // For scatter plots, we need two numeric columns
  if (!xColumn || !yColumn) return [];
  
  return data
    .filter(row => 
      row[xColumn] !== null && row[xColumn] !== undefined && 
      row[yColumn] !== null && row[yColumn] !== undefined
    )
    .map(row => ({
      x: columnTypes[xColumn] === 'numeric' ? Number(row[xColumn]) : row[xColumn],
      y: columnTypes[yColumn] === 'numeric' ? Number(row[yColumn]) : row[yColumn],
    }))
    .filter(point => !isNaN(point.x) && !isNaN(point.y))
    .slice(0, 1000); // Limit to 1000 points for performance
};

const prepareHeatmapData = (
  data: DataRow[], 
  columns: string[],
  columnTypes: Record<string, ColumnType>
) => {
  // For heatmaps, we need at least two categorical columns
  if (columns.length < 2) return [];
  
  const [rowColumn, colColumn] = columns;
  
  // Get unique values for each dimension
  const rowValues = [...new Set(data.map(row => String(row[rowColumn] || 'Unknown')))];
  const colValues = [...new Set(data.map(row => String(row[colColumn] || 'Unknown')))];
  
  // Limit to top 20 values for each dimension
  const limitedRowValues = rowValues.slice(0, 20);
  const limitedColValues = colValues.slice(0, 20);
  
  // Count occurrences for each combination
  const counts: Record<string, Record<string, number>> = {};
  
  limitedRowValues.forEach(row => {
    counts[row] = {};
    limitedColValues.forEach(col => {
      counts[row][col] = 0;
    });
  });
  
  data.forEach(row => {
    const rowVal = String(row[rowColumn] || 'Unknown');
    const colVal = String(row[colColumn] || 'Unknown');
    
    if (limitedRowValues.includes(rowVal) && limitedColValues.includes(colVal)) {
      counts[rowVal][colVal] = (counts[rowVal][colVal] || 0) + 1;
    }
  });
  
  // Convert to array format
  const result = [];
  limitedRowValues.forEach(row => {
    limitedColValues.forEach(col => {
      result.push({
        x: col,
        y: row,
        value: counts[row][col]
      });
    });
  });
  
  return result;
};