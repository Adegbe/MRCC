/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: true,
    optimizePackageImports: [
      'js-sha256',
      'papaparse',
      'xlsx'
    ]
  },
  
  // Add this to ignore invalid package.json
  webpack: (config) => {
    config.plugins = config.plugins || [];
    config.plugins.push(new (require('webpack').IgnorePlugin)({
      resourceRegExp: /\/src\/services\/package\.json$/
    }));
    return config;
  }
};
