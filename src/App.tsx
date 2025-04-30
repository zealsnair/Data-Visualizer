import React from 'react';
import { DataProvider } from './context/DataContext';
import Header from './components/layout/Header';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <DataProvider>
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Header />
        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
          <Dashboard />
        </main>
        <footer className="py-4 px-6 bg-white border-t border-neutral-200">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-neutral-500">
            <p>© {new Date().getFullYear()} DataInsights</p>
            <p className="mt-2 md:mt-0">Analyze and visualize your data with ease</p>
          </div>
        </footer>
      </div>
    </DataProvider>
  );
}

export default App;