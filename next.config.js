/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    // Add this to ignore the problematic package.json
    config.plugins.push(
      new (require('webpack').IgnorePlugin)({
        resourceRegExp: /\/src\/services\/package\.json$/
      })
    );
    return config;
  }
};
