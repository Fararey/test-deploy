import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import { initDatabase } from './config/sequelize.js';
import { fillInitDb } from './config/fillInitDb.js';
import { Company, Log } from './models/index.js';
import { applyAssociations } from './applyAssociations.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3500;

// создаем связи
(async () => {
  try {
    applyAssociations(); // Синхронная функция
    await initDatabase(); // Ensure all tables are created
    await fillInitDb(); // Populate initial data
  } catch (error) {
    console.error('Error during startup:', error);
    console.log('Server will continue without full initialization...');
  }
})();

// Middleware
const corsOptions = {
  async origin(origin, callback) {
    // В development разрешаем localhost
    if (process.env.NODE_ENV !== 'production') {
      if (
        !origin ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
        callback(null, true);
        return;
      }
    }

    // В production проверяем домены из базы данных
    if (process.env.NODE_ENV === 'production') {
      if (!origin) {
        // Запросы без Origin (например, Postman, curl)
        callback(null, true);
        return;
      }

      // Разрешаем системные домены
      const systemDomains = [
        'api.justcreatedsite.ru',
        'meta.justcreatedsite.ru',
        'traefik.justcreatedsite.ru',
      ];

      const domain = origin.replace(/^https?:\/\//, '');
      if (systemDomains.includes(domain)) {
        callback(null, true);
        return;
      }

      // Проверяем клиентские домены в базе данных
      const company = await Company.findOne({
        where: { domain },
      });

      if (company) {
        callback(null, true);
        return;
      }
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Middleware для определения компании по домену
app.use(async (req, res, next) => {
  console.log(1, req.headers);
  console.log(2, req.hostname);
  const { host } = req.headers;
  if (!host) {
    return res.status(400).json({ message: 'Host header is missing' });
  }

  // В development режиме используем localhost
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    req.company = await Company.findOne({ where: { domain: 'localhost' } });
  } else {
    req.company = await Company.findOne({ where: { domain: host } });
  }

  next();
});

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

    // Проверяем, что компания существует
    if (!req.company) {
      return res.status(404).json({
        success: false,
        message: 'Компания не найдена',
      });
    }

    // Проверяем наличие полей
    if (!name || !password) {
      // Записываем неуспешную попытку
      await Log.create({
        username: name || 'unknown',
        success: false,
        ipAddress,
        userAgent,
        companyId: req.company.id,
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
      companyId: req.company.id,
    });

    if (isAuthenticated) {
      return res.status(200).json({
        success: true,
        message: 'Аутентификация успешна!',
        user: {
          name,
          role: 'admin',
        },
        company: {
          id: req.company.id,
          name: req.company.name,
          domain: req.company.domain,
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
    if (!req.company) {
      return res.status(404).json({
        success: false,
        message: 'Компания не найдена',
      });
    }

    const logs = await Log.findAll({
      where: { companyId: req.company.id },
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

// GET endpoint для получения информации о компании
app.get('/api/company', async (req, res) => {
  try {
    if (!req.company) {
      return res.status(404).json({
        success: false,
        message: 'Компания не найдена',
      });
    }

    return res.status(200).json({
      success: true,
      company: {
        id: req.company.id,
        name: req.company.name,
        domain: req.company.domain,
        description: req.company.description,
        logo: req.company.logo,
        status: req.company.status,
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Ошибка при получении информации о компании:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка при получении информации о компании',
    });
  }
});

// ===== META ADMIN API =====

// POST endpoint для логина в метаадминку
app.post('/api/meta/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Логин и пароль обязательны',
      });
    }

    // Простая проверка учетных данных
    if (username === 'admin' && password === 'qwerty') {
      // Устанавливаем куку на 30 дней
      res.cookie('isLogged', 'true', {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });

      return res.status(200).json({
        success: true,
        message: 'Вход в метаадминку успешен',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Неверные учетные данные',
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Ошибка при входе в метаадминку:', error);
    return res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
    });
  }
});

// Middleware для проверки авторизации в метаадминке
const checkMetaAuth = (req, res, next) => {
  if (req.cookies.isLogged === 'true') {
    next();
  } else {
    res.status(401).json({
      success: false,
      message: 'Необходима авторизация',
    });
  }
};

// GET endpoint для получения всех компаний (только для метаадминки)
app.get('/api/meta/companies', checkMetaAuth, async (req, res) => {
  try {
    const companies = await Company.findAll({
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      success: true,
      companies: companies.map((company) => ({
        id: company.id,
        name: company.name,
        domain: company.domain,
        description: company.description,
        logo: company.logo,
        status: company.status,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
      })),
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Ошибка при получении компаний:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка при получении компаний',
    });
  }
});

// POST endpoint для создания новой компании
app.post('/api/meta/companies', checkMetaAuth, async (req, res) => {
  try {
    const { name, domain, description, logo } = req.body;

    if (!name || !domain) {
      return res.status(400).json({
        success: false,
        message: 'Название и домен обязательны',
      });
    }

    const company = await Company.create({
      name,
      domain,
      description: description || '',
      logo: logo || '',
      status: 'active',
    });

    return res.status(201).json({
      success: true,
      message: 'Компания создана успешно',
      company: {
        id: company.id,
        name: company.name,
        domain: company.domain,
        description: company.description,
        logo: company.logo,
        status: company.status,
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Ошибка при создании компании:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка при создании компании',
    });
  }
});

// PUT endpoint для обновления компании
app.put('/api/meta/companies/:id', checkMetaAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, domain, description, logo, status } = req.body;

    const company = await Company.findByPk(id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Компания не найдена',
      });
    }

    await company.update({
      name: name || company.name,
      domain: domain || company.domain,
      description:
        description !== undefined ? description : company.description,
      logo: logo !== undefined ? logo : company.logo,
      status: status || company.status,
    });

    return res.status(200).json({
      success: true,
      message: 'Компания обновлена успешно',
      company: {
        id: company.id,
        name: company.name,
        domain: company.domain,
        description: company.description,
        logo: company.logo,
        status: company.status,
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Ошибка при обновлении компании:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении компании',
    });
  }
});

// DELETE endpoint для удаления компании
app.delete('/api/meta/companies/:id', checkMetaAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findByPk(id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Компания не найдена',
      });
    }

    await company.destroy();

    return res.status(200).json({
      success: true,
      message: 'Компания удалена успешно',
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Ошибка при удалении компании:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка при удалении компании',
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
