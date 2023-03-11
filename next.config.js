/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // true 会导致 useEffect(func, []) 执行两次
  output: 'standalone',
}

module.exports = nextConfig
