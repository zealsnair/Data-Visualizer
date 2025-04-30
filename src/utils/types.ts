export interface DataRow {
  [key: string]: any;
}

export type ColumnType = 'numeric' | 'categorical' | 'boolean' | 'date' | 'unknown';

export interface ColumnStats {
  type: ColumnType;
  count: number;
  uniqueCount?: number;
  missing: number;
  // Numeric statistics
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
  std?: number;
  // Categorical statistics
  frequencies?: Record<string, number>;
  // Date statistics
  minDate?: Date;
  maxDate?: Date;
}

export interface DataStats {
  rowCount: number;
  columnCount: number;
  columnStats: Record<string, ColumnStats>;
}

export interface ChartConfig {
  title: string;
  xAxis?: string;
  yAxis?: string;
  type: string;
  color?: string;
}

export interface InsightType {
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  description: string;
}