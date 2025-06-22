/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.plugins = config.plugins || [];
    config.plugins.push(new (require('webpack').IgnorePlugin)({
      resourceRegExp: /\/src\/services\/package\.json$/
    }));
    return config;
  }
};
