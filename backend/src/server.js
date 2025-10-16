import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3500;

// Middleware
app.use(cors());
app.use(express.json());

// Простые учетные данные для тестирования
const ADMIN_CREDENTIALS = {
  name: 'admin',
  password: 'qwerty123',
};

// POST endpoint для аутентификации
app.post('/api/login', (req, res) => {
  try {
    const { name, password } = req.body;

    // Проверяем наличие полей
    if (!name || !password) {
      return res.status(400).json({
        success: false,
        message: 'Имя и пароль обязательны',
      });
    }

    // Проверяем учетные данные
    if (
      name === ADMIN_CREDENTIALS.name &&
      password === ADMIN_CREDENTIALS.password
    ) {
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
    console.error('Ошибка при аутентификации:', error);
    return res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
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

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Login endpoint: http://localhost:${PORT}/api/login`);
});
