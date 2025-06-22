/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    // Add alias for components
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/services': path.resolve(__dirname, 'src/services')
    };
    
    // Ignore package.json in services directory
    config.plugins.push(
      new (require('webpack').IgnorePlugin)({
        resourceRegExp: /\/src\/services\/package\.json$/
      })
    );
    
    return config;
  }
};
