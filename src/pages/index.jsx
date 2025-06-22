import { useState, useRef } from 'react';
import Head from 'next/head';
import FileUpload from '@components/FileUpload';
import SummaryPanel from '@components/SummaryPanel';
import OptionsPanel from '@components/OptionsPanel';
import DataPreview from '@components/DataPreview';
import { cleanData } from '@services/dataCleaner';
export default function Home() {
  const [file, setFile] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [cleanedData, setCleanedData] = useState(null);
  const [report, setReport] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [options, setOptions] = useState({
    normalizeColumns: true,
    standardizeGender: true,
    handleMissing: true,
    removeDuplicates: true,
    maskPII: true,
    correctInvalid: true,
    validateTypes: true
  });
  const downloadLinkRef = useRef(null);

  const handleFileUpload = (uploadedFile) => {
    setFile(uploadedFile);
    setCleanedData(null);
    setReport(null);
    
    // Set mock file info (will be replaced with actual data from file)
    setFileInfo({
      type: uploadedFile.name.split('.').pop().toUpperCase(),
      rows: 1000,
      columns: 20
    });
  };

  const handleOptionChange = (option) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const processData = async () => {
    if (!file) return;
    
    setProcessing(true);
    try {
      const result = await cleanData(file, options);
      setCleanedData(result.cleanedData);
      setReport(result.report);
    } catch (error) {
      console.error('Error processing data:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = (format) => {
    if (!cleanedData) return;
    
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
    <div className="min-h-screen bg-white">
      <Head>
        <title>MRCC EMR Preprocessing Tool</title>
        <meta name="description" content="Data cleaning tool for EMR systems" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com/" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?display=swap&family=Inter:wght@400;500;700;900&family=Noto+Sans:wght@400;500;700;900"
        />
      </Head>

      <header className="flex items-center justify-between border-b border-gray-200 px-4 md:px-10 py-3">
        <div className="flex items-center gap-4 text-gray-900">
          <div className="h-4 w-4">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-tight">Data Cleaner</h2>
        </div>
        <div className="flex flex-1 justify-end gap-4 md:gap-8">
          <div className="flex items-center gap-4 md:gap-9">
            <a className="text-sm font-medium leading-normal hover:text-blue-600" href="#">Home</a>
            <a className="text-sm font-medium leading-normal hover:text-blue-600" href="#">Documentation</a>
            <a className="text-sm font-medium leading-normal hover:text-blue-600" href="#">Support</a>
          </div>
          <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gray-200 border-2 border-dashed" />
        </div>
      </header>

      <main className="px-4 md:px-10 lg:px-20 xl:px-40 py-5">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold leading-tight p-4">MRCC EMR Preprocessing Tool</h1>
          
          <FileUpload onFileUpload={handleFileUpload} />
          
          {fileInfo && <SummaryPanel fileInfo={fileInfo} />}
          
          <OptionsPanel 
            options={options} 
            onOptionChange={handleOptionChange} 
            onProcess={processData} 
            processing={processing}
          />
          
          {cleanedData && (
            <>
              <DataPreview data={cleanedData} />
              <div className="flex flex-wrap gap-3 px-4 py-3">
                <button
                  onClick={() => handleDownload('csv')}
                  className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-blue-100 hover:bg-blue-200 text-gray-900 text-sm font-bold leading-normal tracking-tight"
                  disabled={processing}
                >
                  Download Cleaned File (CSV)
                </button>
                <button
                  onClick={() => handleDownload('json')}
                  className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-bold leading-normal tracking-tight"
                  disabled={processing}
                >
                  Download Cleaning Report
                </button>
              </div>
            </>
          )}
          
          <div className="px-4 py-5">
            <h2 className="text-xl font-bold leading-tight tracking-tight mb-3">Notes</h2>
            <p className="text-base font-normal leading-normal">
              This tool is designed for internal use only. Please ensure all data handling complies with privacy regulations. For any issues, contact the IT support team.
            </p>
          </div>
        </div>
      </main>

      <footer className="flex justify-center py-6 md:py-10">
        <p className="text-gray-600 text-sm md:text-base font-normal leading-normal">
          © 2025 MRCC Solutions Inc. All rights reserved. Version 1.2.3
        </p>
      </footer>

      <a ref={downloadLinkRef} className="hidden" />
    </div>
  );
}
