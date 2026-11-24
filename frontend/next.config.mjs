/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  reactStrictMode: false, // Prevents duplicate canvas mount issues in dev mode
};

export default nextConfig;
