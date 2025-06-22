import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // 開発時のESLintエラーを警告レベルに下げる
    ignoreDuringBuilds: false,
  },
  typescript: {
    // 開発時のTypeScriptエラーを無視
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
