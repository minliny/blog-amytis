import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // trailingSlash: true (default) — pages export as slug/index.html.
  // Co-located asset directories (slug/images/) coexist cleanly and Nginx
  // serves slug/ directly via the index directive. No redirect needed.
  trailingSlash: true,
  // trailingSlash: false — pages export as slug.html.
  // rehype-image-metadata rewrites image paths to absolute URLs so
  // co-located images still work. Pair with the nginx.conf.example
  // "Trailing slash removal" block to redirect /slug/ → /slug.
  // trailingSlash: false,
  output: "export",
  images: {
    loader: "custom",
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  transpilePackages: ["next-image-export-optimizer"],
  env: {
    nextImageExportOptimizer_imageFolderPath: "public",
    nextImageExportOptimizer_exportFolderPath: "out",
    nextImageExportOptimizer_quality: "75",
    nextImageExportOptimizer_storePicturesInWEBP: "true",
    nextImageExportOptimizer_generateAndUseBlurImages: "true",
  },
};

export default nextConfig;
