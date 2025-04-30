import React, { useRef, useState } from 'react';
import { useData } from '../context/DataContext';
import { parseFile, generateSampleData } from '../utils/fileParser';
import { FileUp, Database, Loader } from 'lucide-react';

interface FileUploaderProps {
  setError: (error: string | null) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ setError }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setData, setIsLoading, setFileName } = useData();
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    setIsLoading(true);
    
    try {
      const parsedData = await parseFile(file);
      
      if (parsedData.length === 0) {
        throw new Error('The file contains no data');
      }
      
      setData(parsedData);
      setFileName(file.name);
      setError(null);
    } catch (error) {
      console.error('Error parsing file:', error);
      setError(error instanceof Error ? error.message : 'Failed to parse file');
      setData([]);
    } finally {
      setUploading(false);
      setIsLoading(false);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleLoadSample = () => {
    setError(null);
    setIsLoading(true);
    
    // Simulate loading time
    setTimeout(() => {
      const sampleData = generateSampleData();
      setData(sampleData);
      setFileName('sample-data.csv');
      setIsLoading(false);
    }, 800);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-wrap gap-3">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv,.xlsx,.xls"
        className="hidden"
      />
      
      <button
        onClick={handleButtonClick}
        disabled={uploading}
        className="btn btn-primary flex items-center gap-2"
      >
        {uploading ? (
          <Loader size={18} className="animate-spin" />
        ) : (
          <FileUp size={18} />
        )}
        <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
      </button>
      
      <button
        onClick={handleLoadSample}
        disabled={uploading}
        className="btn btn-outline flex items-center gap-2"
      >
        <Database size={18} />
        <span>Load Sample Data</span>
      </button>
    </div>
  );
};

export default FileUploader;