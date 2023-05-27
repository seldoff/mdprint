const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
}

module.exports = withBundleAnalyzer(nextConfig)
