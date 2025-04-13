/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_FINMIND_API_URL: process.env.NEXT_PUBLIC_FINMIND_API_URL,
  },
};

export default nextConfig;
