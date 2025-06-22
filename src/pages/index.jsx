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
    validateTypes: true,
  });
  const downloadLinkRef = useRef(null);

  const handleFileUpload = (uploadedFile) => {
    setFile(uploadedFile);
    setCleanedData(null);
    setReport(null);
    setFileInfo({
      type: uploadedFile.name.split('.').pop().toUpperCase(),
      rows: 1000,
      columns: 20,
    });
  };

  const handleOptionChange = (option) => {
    setOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
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

    let blob;
    if (format === 'csv') {
      const headers = Object.keys(cleanedData[0]);
      const csvContent = [
        headers.join(','),
        ...cleanedData.map((row) =>
          headers.map((field) => `"${String(row[field] || '').replace(/"/g, '""')}"`).join(',')
        ),
      ].join('\n');
      blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    } else if (format === 'json') {
      blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    }

    const url = URL.createObjectURL(blob);
    if (downloadLinkRef.current) {
      downloadLinkRef.current.href = url;
      downloadLinkRef.current.download = format === 'csv' ? 'cleaned_data.csv' : 'cleaning_report.json';
      downloadLinkRef.current.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Head>
        <title>MRCC EMR Preprocessing Tool</title>
        <meta name="description" content="Data cleaning tool for EMR systems" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=Noto+Sans:wght@400;500;700;900&display=swap"
        />
      </Head>

      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 shadow bg-white">
        <div className="text-xl font-bold text-gray-900">MRCC Data Cleaner</div>
        <nav className="flex space-x-6 text-sm font-medium text-gray-600">
          <a href="#" className="hover:text-blue-600">Home</a>
          <a href="#" className="hover:text-blue-600">Documentation</a>
          <a href="#" className="hover:text-blue-600">Support</a>
        </nav>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 py-10 bg-white shadow rounded-lg mt-8">
        <h2 className="text-3xl font-bold leading-tight tracking-tight mb-6">MRCC EMR Preprocessing Tool</h2>

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
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => handleDownload('csv')}
                className="bg-blue-100 hover:bg-blue-200 text-sm font-semibold px-6 py-2 rounded-xl"
              >
                Download Cleaned File (CSV)
              </button>
              <button
                onClick={() => handleDownload('json')}
                className="bg-gray-100 hover:bg-gray-200 text-sm font-semibold px-6 py-2 rounded-xl"
              >
                Download Cleaning Report
              </button>
            </div>
          </>
        )}

        <section className="pt-6">
          <h3 className="text-lg font-bold mb-2">Notes</h3>
          <p className="text-sm text-gray-700">
            This tool is designed for internal use only. Ensure all data handling complies with privacy regulations.
            For any issues, contact the IT support team.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        © 2025 MRCC Solutions Inc. All rights reserved. Version 1.2.3
      </footer>

      <a ref={downloadLinkRef} className="hidden" />
    </div>
  );
}
