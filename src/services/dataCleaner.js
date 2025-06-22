import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { sha256 } from 'js-sha256';

// Helper function to parse different file types
const parseFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const extension = file.name.split('.').pop().toLowerCase();
    
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        
        switch (extension) {
          case 'csv':
            Papa.parse(data, {
              header: true,
              skipEmptyLines: true,
              complete: (results) => {
                resolve(results.data);
              },
              error: (error) => reject(error)
            });
            break;
            
          case 'xls':
          case 'xlsx':
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            resolve(XLSX.utils.sheet_to_json(worksheet));
            break;
            
          case 'json':
            resolve(JSON.parse(data));
            break;
            
          default:
            reject(new Error(`Unsupported file format: ${extension}`));
        }
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    if (extension === 'xls' || extension === 'xlsx') {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file);
    }
  });
};

// Normalize column names to lowercase with underscores
const normalizeColumnNames = (data) => {
  if (!data.length) return data;
  
  const columnMap = {};
  Object.keys(data[0]).forEach(key => {
    const normalized = key
      .trim()
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '_');
    columnMap[key] = normalized;
  });
  
  return data.map(row => {
    const newRow = {};
    for (const [key, value] of Object.entries(row)) {
      newRow[columnMap[key]] = value;
    }
    return newRow;
  });
};

// Clean and standardize string values
const cleanStringData = (data) => {
  return data.map(row => {
    const newRow = {};
    for (const [key, value] of Object.entries(row)) {
      if (typeof value === 'string') {
        // Trim whitespace
        let cleaned = value.trim();
        
        // Standardize gender values
        if (key.includes('gender') || key.includes('sex')) {
          cleaned = cleaned.toLowerCase();
          if (['m', 'male'].includes(cleaned)) cleaned = 'Male';
          else if (['f', 'female'].includes(cleaned)) cleaned = 'Female';
        }
        
        // Remove special characters (except basic punctuation)
        cleaned = cleaned.replace(/[^\w\s.,-]/g, '');
        
        newRow[key] = cleaned;
      } else {
        newRow[key] = value;
      }
    }
    return newRow;
  });
};

// Convert date columns to ISO 8601 format
const standardizeDates = (data) => {
  const dateColumns = Object.keys(data[0] || {}).filter(key => 
    key.includes('date') || key.includes('dob') || key.includes('time')
  );
  
  return data.map(row => {
    const newRow = { ...row };
    for (const col of dateColumns) {
      if (row[col]) {
        try {
          const date = new Date(row[col]);
          if (!isNaN(date)) {
            newRow[col] = date.toISOString().split('T')[0]; // YYYY-MM-DD format
          }
        } catch (e) {
          // Leave as-is if conversion fails
        }
      }
    }
    return newRow;
  });
};

// Handle missing values
const handleMissingValues = (data) => {
  if (!data.length) return data;
  
  const totalRows = data.length;
  const columns = Object.keys(data[0]);
  
  // Calculate missing percentages
  const missingPercentages = {};
  for (const col of columns) {
    const missingCount = data.filter(row => 
      row[col] === null || row[col] === undefined || row[col] === ''
    ).length;
    missingPercentages[col] = missingCount / totalRows;
  }
  
  // Drop columns with >50% missing values
  const colsToDrop = Object.keys(missingPercentages).filter(
    col => missingPercentages[col] > 0.5
  );
  
  let cleanedData = data.map(row => {
    const newRow = { ...row };
    for (const col of colsToDrop) {
      delete newRow[col];
    }
    return newRow;
  });
  
  // Impute remaining missing values
  const columnStats = {};
  const remainingColumns = Object.keys(cleanedData[0] || {});
  
  // Calculate stats for each column
  for (const col of remainingColumns) {
    const values = cleanedData.map(row => row[col]).filter(val => 
      val !== null && val !== undefined && val !== ''
    );
    
    if (values.length === 0) continue;
    
    // Determine column type
    const isNumeric = values.some(val => !isNaN(parseFloat(val)));
    const isDate = col.includes('date') || col.includes('dob');
    
    if (isNumeric) {
      // Numeric column - calculate median
      const numericValues = values.map(Number).sort((a, b) => a - b);
      const mid = Math.floor(numericValues.length / 2);
      columnStats[col] = {
        type: 'numeric',
        imputeValue: numericValues.length % 2 !== 0 
          ? numericValues[mid] 
          : (numericValues[mid - 1] + numericValues[mid]) / 2
      };
    } else if (isDate) {
      // Date column - drop rows with missing dates
      columnStats[col] = { type: 'date' };
    } else {
      // Categorical column - find mode
      const frequency = {};
      let maxCount = 0;
      let mode = '';
      
      for (const val of values) {
        const strVal = String(val);
        frequency[strVal] = (frequency[strVal] || 0) + 1;
        if (frequency[strVal] > maxCount) {
          maxCount = frequency[strVal];
          mode = strVal;
        }
      }
      
      columnStats[col] = {
        type: 'categorical',
        imputeValue: mode || 'unknown'
      };
    }
  }
  
  // Apply imputation
  cleanedData = cleanedData.map(row => {
    const newRow = { ...row };
    for (const col of remainingColumns) {
      if (
        newRow[col] === null || 
        newRow[col] === undefined || 
        newRow[col] === ''
      ) {
        const stats = columnStats[col];
        if (stats) {
          if (stats.type === 'date') {
            // For date columns, we'll set to null and filter later
            newRow[col] = null;
          } else {
            newRow[col] = stats.imputeValue;
          }
        }
      }
    }
    return newRow;
  });
  
  // Filter out rows with missing dates
  const dateColumns = remainingColumns.filter(col => 
    columnStats[col]?.type === 'date'
  );
  
  if (dateColumns.length > 0) {
    cleanedData = cleanedData.filter(row => 
      dateColumns.every(col => row[col] !== null)
    );
  }
  
  return cleanedData;
};

// Remove duplicate rows
const removeDuplicates = (data) => {
  if (!data.length) return data;
  
  const seen = new Set();
  return data.filter(row => {
    const key = JSON.stringify(row);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

// Mask PII columns using SHA-256 hashing
const maskPII = (data) => {
  const piiColumns = Object.keys(data[0] || {}).filter(key => 
    key.includes('name') || 
    key.includes('email') || 
    key.includes('phone') || 
    key.includes('address') ||
    key.includes('ssn') ||
    key.includes('id')
  );
  
  return data.map(row => {
    const newRow = { ...row };
    for (const col of piiColumns) {
      if (row[col] && typeof row[col] === 'string') {
        newRow[col] = sha256(row[col]);
      }
    }
    return newRow;
  });
};

// Detect and correct invalid entries
const correctInvalidEntries = (data) => {
  return data.map(row => {
    const newRow = { ...row };
    
    // Correct invalid ages - FIXED THE SYNTAX ERROR HERE
    if ('age' in newRow && newRow.age !== null && newRow.age !== undefined) {
      const ageNum = Number(newRow.age);
      if (!isNaN(ageNum)) {
        if (ageNum < 0 || ageNum > 120) {
          newRow.age = null;
        } else {
          newRow.age = ageNum;
        }
      }
    }
    
    // Correct future dates
    const today = new Date();
    Object.keys(newRow).forEach(key => {
      if (key.includes('date') || key.includes('dob')) {
        try {
          const dateValue = new Date(newRow[key]);
          if (!isNaN(dateValue) && dateValue > today) {
            newRow[key] = null;
          }
        } catch (e) {
          // Ignore invalid dates
        }
      }
    });
    
    // Correct mixed data types
    Object.keys(newRow).forEach(key => {
      if (typeof newRow[key] === 'string') {
        // Try to convert to number if possible
        const numValue = Number(newRow[key]);
        if (!isNaN(numValue)) {
          newRow[key] = numValue;
        }
      }
    });
    
    return newRow;
  });
};

// Main data cleaning function
export const cleanData = async (file, options) => {
  try {
    // 1. Parse the uploaded file
    const rawData = await parseFile(file);
    
    // Store file info for reporting
    const fileInfo = {
      fileName: file.name,
      fileType: file.name.split('.').pop().toUpperCase(),
      originalRows: rawData.length,
      originalColumns: rawData.length > 0 ? Object.keys(rawData[0]).length : 0
    };
    
    // 2. Apply cleaning operations based on user options
    let cleanedData = [...rawData];
    
    // Always do these operations
    cleanedData = cleanStringData(cleanedData);
    cleanedData = correctInvalidEntries(cleanedData);
    
    // Conditionally apply other operations
    if (options.normalizeColumns) {
      cleanedData = normalizeColumnNames(cleanedData);
    }
    
    if (options.standardizeGender) {
      // Standardization is already handled in cleanStringData
    }
    
    if (options.handleMissing) {
      cleanedData = handleMissingValues(cleanedData);
    }
    
    if (options.removeDuplicates) {
      cleanedData = removeDuplicates(cleanedData);
    }
    
    if (options.maskPII) {
      cleanedData = maskPII(cleanedData);
    }
    
    if (options.validateTypes) {
      cleanedData = standardizeDates(cleanedData);
    }
    
    // 3. Prepare processing report
    const report = {
      ...fileInfo,
      cleanedRows: cleanedData.length,
      cleanedColumns: cleanedData.length > 0 ? Object.keys(cleanedData[0]).length : 0,
      rowsRemoved: fileInfo.originalRows - cleanedData.length,
      optionsApplied: Object.keys(options).filter(opt => options[opt]),
      processingTime: new Date().toISOString()
    };
    
    // 4. Return processed data and report
    return {
      cleanedData,
      report
    };
    
  } catch (error) {
    console.error('Data cleaning failed:', error);
    throw error;
  }
};
