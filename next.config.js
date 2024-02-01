/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "export",
  distDir: "out",
  eslint: {
    ignoreDuringBuilds: true,  // turn linting back on if lint action is disabled
  },
};

module.exports = nextConfig;
