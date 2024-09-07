/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    CONTRACT_ID: process.env.CONTRACT_ID,
  },
}

module.exports = nextConfig;
