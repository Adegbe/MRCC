const SummaryPanel = ({ fileInfo }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold leading-tight tracking-tight mb-3">File Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-[20%_1fr] gap-x-6 border-t border-gray-200">
        <div className="py-3 border-b border-gray-200">
          <p className="text-gray-600 text-sm font-normal leading-normal">File Type</p>
          <p className="text-gray-900 text-sm font-normal leading-normal">{fileInfo.type}</p>
        </div>
        <div className="py-3 border-b border-gray-200">
          <p className="text-gray-600 text-sm font-normal leading-normal">Number of Rows</p>
          <p className="text-gray-900 text-sm font-normal leading-normal">{fileInfo.rows.toLocaleString()}</p>
        </div>
        <div className="py-3 border-b border-gray-200">
          <p className="text-gray-600 text-sm font-normal leading-normal">Number of Columns</p>
          <p className="text-gray-900 text-sm font-normal leading-normal">{fileInfo.columns}</p>
        </div>
      </div>
      <div className="flex px-4 py-3 justify-start">
        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-bold leading-normal tracking-tight">
          <span className="truncate">Show Column Summary</span>
        </button>
      </div>
    </div>
  );
};

export default SummaryPanel;
