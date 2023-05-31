const WithBundleAnalyzer = require("@next/bundle-analyzer")

/** @type {import('next').NextConfig} */
let nextConfig = {
  output: "export",
}

if (process.env.ANALYZE_BUNDLE === "true") {
  nextConfig = WithBundleAnalyzer()(nextConfig)
}

module.exports = nextConfig
