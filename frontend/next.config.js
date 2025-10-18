/** @type {import('next').NextConfig} */
const nextConfig = {
  // Переменные окружения для консоли
  env: {
    KEEP_CONSOLE: process.env.KEEP_CONSOLE || 'true',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://justcreatedsite.ru/api/:path*',
      },
    ]
  },
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

    // Сохраняем console.log в production (если KEEP_CONSOLE=true)
    if (!dev && process.env.KEEP_CONSOLE === 'true') {
      config.optimization.minimizer = config.optimization.minimizer.map(
        (plugin) => {
          if (plugin.constructor.name === 'TerserPlugin') {
            plugin.options.terserOptions.compress.drop_console = false
          }
          return plugin
        }
      )
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
