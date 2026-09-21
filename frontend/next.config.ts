import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  env: {
    PUBLIC_API_URL: 'http://localhost:5000/api'
  }
}

export default nextConfig;
