import JavaScriptObfuscator from 'webpack-obfuscator';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },

  webpack: (config, { dev, isServer }) => {
    // Only apply obfuscation in production client builds
    if (!dev && !isServer) {
      config.plugins.push(
        new JavaScriptObfuscator(
          {
            rotateStringArray: true,
            stringArray: true,
            stringArrayThreshold: 0.75,
            deadCodeInjection: false,
            debugProtection: false,
            disableConsoleOutput: true,
            identifierNamesGenerator: 'hexadecimal',
            renameGlobals: false,
            selfDefending: false,
            unicodeEscapeSequence: false,
          },
          []
        )
      );
    }
    return config;
  },
};

export default nextConfig;
