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
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Preprocessing Options</h2>
      <div className="space-y-4">
        {Object.keys(options).map((option) => (
          <label
            key={option}
            className="flex items-start gap-3 text-gray-800 text-sm leading-tight"
          >
            <input
              type="checkbox"
              checked={options[option]}
              onChange={() => onOptionChange(option)}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>{optionLabels[option]}</span>
          </label>
        ))}
      </div>

      <div className="mt-6">
        <button
          onClick={onProcess}
          disabled={processing}
          className={`h-10 px-5 rounded-xl text-sm font-semibold text-white ${
            processing
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {processing ? 'Processing...' : 'Process Data'}
        </button>
      </div>
    </div>
  );
};

export default OptionsPanel;
