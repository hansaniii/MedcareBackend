/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig

// next.config.js

module.exports = {
    async rewrites() {
      return [
        {
          source: '/api/register',
          destination: 'http://localhost:3000/api/register', // Change to your backend server's URL
        },
      ];
    },
  };
  