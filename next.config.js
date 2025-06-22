/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Add these configurations to fix the build issues
  webpack: (config) => {
    // Exclude the problematic package.json from being processed
    config.module.rules.push({
      test: /\/src\/services\/package\.json$/,
      loader: 'ignore-loader'
    });
    
    return config;
  },
  
  // Enable experimental features needed for data processing
  experimental: {
    serverActions: true,
    optimizePackageImports: [
      'js-sha256',
      'papaparse',
      'xlsx'
    ]
  },
  
  // Configure absolute imports
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};
