const FileUpload = ({ onFileUpload }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Your File</h2>
      <label className="block text-sm font-medium text-gray-700 mb-2">Supported formats: CSV, Excel, JSON</label>
      <input
        type="file"
        onChange={handleFileChange}
        accept=".csv,.xls,.xlsx,.json"
        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </div>
  );
};

export default FileUpload;
