const FileUpload = ({ onFileUpload }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Your File</h2>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Supported formats: CSV, Excel, JSON
      </label>

      {/* Small rectangular box */}
      <div className="border border-gray-300 rounded-md p-3 bg-gray-50">
        <input
          type="file"
          onChange={handleFileChange}
          accept=".csv,.xls,.xlsx,.json"
          className="w-full text-sm text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
        />
      </div>
    </div>
  );
};

export default FileUpload;
