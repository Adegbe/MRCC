const OptionsPanel = ({ options, onOptionChange, onProcess, processing }) => {
  const optionLabels = {
    normalizeColumns: "Normalize Column Names",
    standardizeGender: "Standardize Gender Field",
    handleMissing: "Handle Missing Values",
    removeDuplicates: "Detect and Remove Duplicates",
    maskPII: "Mask PII (Personally Identifiable Information)",
    correctInvalid: "Correct Invalid Entries",
    validateTypes: "Validate Data Types"
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold leading-tight tracking-tight mb-3">Preprocessing Options</h2>
      <div className="px-4">
        {Object.keys(options).map((option) => (
          <label key={option} className="flex gap-x-3 py-3 flex-row items-center">
            <input
              type="checkbox"
              checked={options[option]}
              onChange={() => onOptionChange(option)}
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <p className="text-gray-900 text-base font-normal leading-normal">{optionLabels[option]}</p>
          </label>
        ))}
      </div>
      <div className="flex justify-start px-4 py-3">
        <button
          onClick={onProcess}
          disabled={processing}
          className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 ${
            processing ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700'
          } text-white text-sm font-bold leading-normal tracking-tight`}
        >
          {processing ? 'Processing...' : 'Process Data'}
        </button>
      </div>
    </div>
  );
};

export default OptionsPanel;
