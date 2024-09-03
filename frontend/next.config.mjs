/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {  
    const baseUrl = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;
    return [
      {
        source: '/api/:path*',
        destination: `${baseUrl}/api/:path*`,
      },
    ];
  }
};

export default nextConfig;