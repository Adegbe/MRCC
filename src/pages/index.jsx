import { useState, useRef } from 'react';
import Head from 'next/head';
import FileUpload from '@components/FileUpload';
import FileSummary from '@components/FileSummary';
import OptionsPanel from '@components/OptionsPanel';
import DataPreview from '@components/DataPreview';
import SummaryPanel from '@components/SummaryPanel';
import { cleanData } from '@services/dataCleaner';

export default function Home() {
  const [file, setFile] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [originalData, setOriginalData] = useState([]);
  const [cleanedData, setCleanedData] = useState([]);
  const [report, setReport] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [showColumnSummary, setShowColumnSummary] = useState(false);
  const downloadLinkRef = useRef(null);

  const [options, setOptions] = useState({
    normalizeColumns: true,
    standardizeGender: true,
    handleMissing: true,
    removeDuplicates: true,
    maskPII: true,
    correctInvalid: true,
    validateTypes: true
  });

  const handleFileUpload = (file, data, fileInfo) => {
    setFile(file);
    setOriginalData(data);
    setCleanedData([]);
    setReport(null);
    setFileInfo(fileInfo);
    setShowColumnSummary(false);
  };

  const handleOptionChange = (option) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const processData = async () => {
    if (!file || !originalData.length) return;
    
    setProcessing(true);
    try {
      const { cleanedData, report } = await cleanData(originalData, options);
      setCleanedData(cleanedData);
      setReport(report);
    } catch (error) {
      console.error('Error processing data:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = (format) => {
    if (!cleanedData.length) return;
    
    if (format === 'csv') {
      // Convert to CSV
      const headers = Object.keys(cleanedData[0]);
      const csvContent = [
        headers.join(','),
        ...cleanedData.map(row => 
          headers.map(fieldName => 
            `"${String(row[fieldName] || '').replace(/"/g, '""')}"`
          ).join(',')
        )
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      if (downloadLinkRef.current) {
        downloadLinkRef.current.href = url;
        downloadLinkRef.current.download = `cleaned_data.csv`;
        downloadLinkRef.current.click();
      }
    } else if (format === 'json') {
      // Download report as JSON
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      if (downloadLinkRef.current) {
        downloadLinkRef.current.href = url;
        downloadLinkRef.current.download = `cleaning_report.json`;
        downloadLinkRef.current.click();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>MRCC EMR Preprocessing Tool</title>
        <meta name="description" content="Data cleaning tool for EMR systems" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-blue-700 text-white py-4 px-4 md:px-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-6 w-6 text-white">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-lg font-bold">Data Cleaner</h2>
          </div>
          <div className="flex items-center gap-6">
            <a className="text-sm hover:text-blue-200" href="#">Home</a>
            <a className="text-sm hover:text-blue-200" href="#">Documentation</a>
            <a className="text-sm hover:text-blue-200" href="#">Support</a>
            <div className="h-8 w-8 rounded-full bg-blue-500 border-2 border-white" />
          </div>
        </div>
      </header>

      <main className="px-4 md:px-10 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">MRCC EMR Preprocessing Tool</h1>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            {/* Upload Section */}
            <section className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload File</h2>
              <FileUpload onFileUpload={handleFileUpload} disabled={processing} />
            </section>
            
            {fileInfo && (
              <>
                {/* File Summary */}
                <section className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">File Summary</h2>
                  <FileSummary 
                    fileInfo={fileInfo} 
                    showColumnSummary={showColumnSummary} 
                    setShowColumnSummary={setShowColumnSummary} 
                  />
                </section>

                {/* Preprocessing Options */}
                <section className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Preprocessing Options</h2>
                  <OptionsPanel 
                    options={options} 
                    onOptionChange={handleOptionChange} 
                    onProcess={processData} 
                    processing={processing}
                  />
                </section>

                {/* Preview Section */}
                <section className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Preview Cleaned Data</h2>
                  <DataPreview 
                    originalData={originalData} 
                    cleanedData={cleanedData} 
                    loading={processing}
                  />
                  
                  {report && (
                    <SummaryPanel 
                      report={report} 
                      cleanedData={cleanedData} 
                      onDownloadCSV={() => handleDownload('csv')}
                      onDownloadReport={() => handleDownload('json')}
                    />
                  )}
                </section>
              </>
            )}
          </div>
          
          {/* Notes Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Notes</h2>
            <p className="text-gray-600">
              This tool is designed for internal use only. Please ensure all data handling complies with privacy regulations. For any issues, contact the IT support team.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 md:px-10">
          <p className="text-gray-600 text-center text-sm">
            © 2025 MRCC Solutions Inc. All rights reserved. Version 1.2.3
          </p>
        </div>
      </footer>

      <a ref={downloadLinkRef} className="hidden" />
    </div>
  );
}
