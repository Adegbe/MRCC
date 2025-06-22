const DataPreview = ({ data }) => {
  if (!data || data.length === 0) return null;

  const columns = Object.keys(data[0]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold leading-tight tracking-tight mb-3">Preview Cleaned Data</h2>
      <div className="overflow-x-auto rounded-xl border border-gray-300 bg-white">
        <table className="min-w-full">
          <thead>
            <tr className="bg-white">
              {columns.map((column) => (
                <th 
                  key={column} 
                  className="px-4 py-3 text-left text-gray-900 text-sm font-medium leading-normal whitespace-nowrap"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 5).map((row, index) => (
              <tr key={index} className={index > 0 ? "border-t border-gray-200" : ""}>
                {columns.map((column) => (
                  <td 
                    key={`${index}-${column}`} 
                    className="px-4 py-2 text-gray-700 text-sm font-normal leading-normal h-[72px] whitespace-nowrap"
                  >
                    {row[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataPreview;
