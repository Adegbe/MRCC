const SummaryPanel = ({ fileInfo }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">File Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">File Type</span>
          <span className="text-base text-gray-900 font-medium">{fileInfo.type}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Number of Rows</span>
          <span className="text-base text-gray-900 font-medium">{fileInfo.rows.toLocaleString()}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Number of Columns</span>
          <span className="text-base text-gray-900 font-medium">{fileInfo.columns}</span>
        </div>
      </div>

      <div className="mt-6">
        <button
          className="inline-flex items-center justify-center h-10 px-5 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-900"
        >
          Show Column Summary
        </button>
      </div>
    </div>
  );
};

export default SummaryPanel;
