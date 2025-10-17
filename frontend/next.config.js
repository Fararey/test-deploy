/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: [
      'localhost',
      'justcreatedsite.ru',
      'storage.yandexcloud.net',
      'via.placeholder.com',
      'upload.wikimedia.org',
    ],
  },
  // Конфигурация для production
  webpack: (config, { dev, isServer }) => {
    // В production режиме отключаем source maps
    if (!dev) {
      config.devtool = false
    }

    // Игнорируем source maps для внешних библиотек
    config.ignoreWarnings = [
      /Failed to parse source map/,
      /Can't resolve .*\.map/,
    ]

    // Игнорируем source maps для node_modules
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    })

    return config
  },
}
module.exports = nextConfig
