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

      <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
        <input
          type="file"
          onChange={handleFileChange}
          accept=".csv,.xls,.xlsx,.json"
          className="block w-full text-sm text-gray-700"
        />
      </div>
    </div>
  );
};

export default FileUpload;
