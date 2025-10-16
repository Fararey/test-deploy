/** @type {import('next').NextConfig} */
const nextConfig = {

  reactStrictMode: true,
  // Настройки ревалидации для страниц блога
  experimental: {
    // Включаем оптимизированную ревалидацию
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
  images: {
    domains: [
      'localhost',
      'storage.yandexcloud.net',
      'via.placeholder.com',
      'upload.wikimedia.org',
    ],
  },
  // Конфигурация для разных окружений FIX В БУДУЩЕМ
  webpack: (config, { dev, isServer }) => {
    console.log('Webpack config - dev mode:', dev, 'isServer:', isServer)

    // В режиме разработки включаем source maps

    config.devtool = 'eval-source-map'
    // Игнорируем source maps для внешних библиотек в dev режиме
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
