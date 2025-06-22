const FileUpload = ({ onFileUpload }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold leading-tight tracking-tight mb-3">Upload File</h2>
      <div className="max-w-md">
        <label className="flex flex-col">
          <p className="text-base font-medium leading-normal pb-2">Choose File</p>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".csv,.xls,.xlsx,.json"
            className="w-full flex-1 rounded-xl border border-gray-300 bg-white p-4 text-base font-normal leading-normal text-gray-900 placeholder:text-gray-500 focus:border-gray-300 focus:outline-none focus:ring-0 h-14"
          />
        </label>
      </div>
    </div>
  );
};

export default FileUpload;
