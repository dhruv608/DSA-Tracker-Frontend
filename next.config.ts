import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "dsa-tracker-student-images-471613014213-ap-south-1-an.s3.ap-south-1.amazonaws.com",
      },
    ],
    qualities: [100, 75],
  },
};

export default nextConfig;