import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import sequelize, { initDatabase } from './config/database.js';
import Log from './models/Log.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3500;

// Initialize database connection
(async () => {
  try {
    await initDatabase(); // Ensure all tables are created
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error during startup:', error);
    // Don't exit immediately, let the main startServer function handle it
  }
})();

// Middleware
app.use(cors());
app.use(express.json());

// Простые учетные данные для тестирования
const ADMIN_CREDENTIALS = {
  name: 'admin',
  password: 'qwerty123',
};

// POST endpoint для аутентификации
app.post('/api/login', async (req, res) => {
  try {
    const { name, password } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    // Проверяем наличие полей
    if (!name || !password) {
      // Записываем неуспешную попытку
      await Log.create({
        username: name || 'unknown',
        success: false,
        ipAddress,
        userAgent,
      });

      return res.status(400).json({
        success: false,
        message: 'Имя и пароль обязательны',
      });
    }

    // Проверяем учетные данные
    const isAuthenticated =
      name === ADMIN_CREDENTIALS.name &&
      password === ADMIN_CREDENTIALS.password;

    // Записываем результат в базу данных
    await Log.create({
      username: name,
      success: isAuthenticated,
      ipAddress,
      userAgent,
    });

    if (isAuthenticated) {
      return res.status(200).json({
        success: true,
        message: 'Аутентификация успешна!',
        user: {
          name,
          role: 'admin',
        },
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Неверные учетные данные',
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Ошибка при аутентификации:', error);
    return res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
    });
  }
});

// GET endpoint для получения логов
app.get('/api/logs', async (req, res) => {
  try {
    const logs = await Log.findAll({
      order: [['timestamp', 'DESC']],
      limit: 50, // Ограничиваем количество логов
    });

    return res.status(200).json({
      success: true,
      logs: logs.map((log) => ({
        id: log.id,
        username: log.username,
        success: log.success,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        timestamp: log.timestamp,
      })),
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Ошибка при получении логов:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка при получении логов',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Сервер работает',
    timestamp: new Date().toISOString(),
  });
});

// Обработка несуществующих маршрутов
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Маршрут не найден',
  });
});

// Обработчик для всех остальных маршрутов
app.use('*', (req, res) => {
  res.status(404).set('Content-Type', 'application/json').json({
    status: 'Error',
    message: 'Page not found',
  });
});

app.listen(PORT, '0.0.0.0', () =>
  console.log(`Server running on port ${PORT}`),
);
