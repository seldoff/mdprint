import WithBundleAnalyzer from "@next/bundle-analyzer"

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
}

module.exports =
  process.env.ANALYZE_BUNDLE === "true" ? WithBundleAnalyzer()(nextConfig) : nextConfig
