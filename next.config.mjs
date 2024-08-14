/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental : {
    staleTimes: {
      dynamic: 0, //30
      static: 180
    }
  }
};

export default nextConfig;
