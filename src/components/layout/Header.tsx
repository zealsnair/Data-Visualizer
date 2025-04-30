import React, { useState, useEffect } from 'react';
import { BarChart3, Menu, X, Download, Share2 } from 'lucide-react';
import { useData } from '../../context/DataContext';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data, fileName } = useData();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const exportData = () => {
    if (data.length === 0) return;
    
    // Convert data to CSV
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' ? `"${value}"` : value;
        }).join(',')
      )
    ];
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName || 'data_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <header 
      className={`sticky top-0 z-50 bg-white transition-all duration-200 ${
        isScrolled ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          {/* Logo */}
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <a href="#" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-primary-500 flex items-center justify-center">
                <BarChart3 size={20} className="text-white" />
              </div>
              <span className="text-xl font-semibold text-neutral-800">DataInsights</span>
            </a>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
          
          {/* Desktop nav */}
          <nav className="hidden md:flex space-x-10">
            <a href="#" className="text-neutral-700 hover:text-primary-500 transition-colors">
              Dashboard
            </a>
            <a href="#" className="text-neutral-500 hover:text-primary-500 transition-colors">
              Tutorial
            </a>
            <a href="#" className="text-neutral-500 hover:text-primary-500 transition-colors">
              About
            </a>
          </nav>
          
          {/* Right buttons */}
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 gap-3">
            <button 
              onClick={exportData}
              disabled={data.length === 0}
              className="btn btn-outline flex items-center gap-2"
            >
              <Download size={18} />
              <span>Export</span>
            </button>
            <button 
              disabled={data.length === 0}
              className="btn btn-outline flex items-center gap-2"
            >
              <Share2 size={18} />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-neutral-200">
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-neutral-100">
            Dashboard
          </a>
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-500 hover:bg-neutral-100">
            Tutorial
          </a>
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-500 hover:bg-neutral-100">
            About
          </a>
          <div className="flex space-x-2 mt-4 px-3">
            <button 
              onClick={exportData}
              disabled={data.length === 0}
              className="btn btn-outline flex-1 flex items-center justify-center gap-2"
            >
              <Download size={18} />
              <span>Export</span>
            </button>
            <button 
              disabled={data.length === 0}
              className="btn btn-outline flex-1 flex items-center justify-center gap-2"
            >
              <Share2 size={18} />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;