from data_cleaner import DataCleaner

def custom_age_cleaner(df):
    """Custom rule to clean age column"""
    if 'age' in df.columns:
        # Convert any age > 100 to NaN
        df.loc[df['age'] > 100, 'age'] = np.nan
    return df

if __name__ == "__main__":
    # Initialize the cleaner
    cleaner = DataCleaner()
    
    # Configure PII and duplicate detection
    cleaner.set_pii_columns(['name', 'email', 'phone_number'])
    cleaner.set_duplicate_key_columns(['id', 'birth_date'])
    
    # Add a custom rule
    cleaner.add_custom_rule('age_cleaner', custom_age_cleaner)
    
    try:
        # Load the data
        df = cleaner.load_file('input_data.csv')
        
        # Clean the data
        cleaned_df = cleaner.clean_data(df)
        
        # Generate and save report
        report = cleaner.generate_report(cleaned_df, 'reports/data_profile.html')
        
        # Export cleaned data
        output_file = cleaner.export_data(
            cleaned_df, 
            output_path='output/cleaned_data',
            format='csv',
            include_report=True,
            zip_output=True
        )
        
        print(f"Processing complete. Output saved to: {output_file}")
        print(f"Total warnings: {cleaner.report_data['warnings_count']}")
        
    except Exception as e:
        print(f"Error during processing: {str(e)}")
