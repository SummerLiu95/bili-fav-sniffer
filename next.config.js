/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: false, // true 会导致 useEffect(func, []) 执行两次
  output: 'standalone',
  sassOptions: {
    fiber: false,
    includePaths: [path.join(__dirname, 'styles')],
  },
}
module.exports = nextConfig
