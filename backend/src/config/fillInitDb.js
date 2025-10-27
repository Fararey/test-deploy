import { Company, Log, MetaUser } from '../models/index.js';

export const fillInitDb = async () => {
  try {
    console.log('🔄 Инициализация базы данных...');

    // Создаем базовую компанию для localhost (development) и justcreatedsite.ru (production)
    const defaultCompany = await Company.findOrCreate({
      where: { domain: 'localhost' },
      defaults: {
        name: 'Test Company',
        domain: 'localhost',
        description: 'Тестовая компания для разработки',
        logo: '',
        status: 'active',
      },
    });

    // Создаем компанию для production
    const productionCompany = await Company.findOrCreate({
      where: { domain: 'justcreatedsite.ru' },
      defaults: {
        name: 'Just Created Site',
        domain: 'justcreatedsite.ru',
        description: 'Основная компания для продакшена',
        logo: '',
        status: 'active',
      },
    });

    console.log('✅ Базовая компания создана:', defaultCompany[0].name);
    console.log('✅ Продакшен компания создана:', productionCompany[0].name);

    // Создаем тестовые логи для базовой компании (localhost)
    const testLogs = [
      {
        username: 'admin',
        success: true,
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (Test Browser)',
        companyId: defaultCompany[0].id,
      },
      {
        username: 'test_user',
        success: false,
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Test Browser)',
        companyId: defaultCompany[0].id,
      },
    ];

    for (const logData of testLogs) {
      await Log.findOrCreate({
        where: {
          username: logData.username,
          companyId: logData.companyId,
          timestamp: new Date(),
        },
        defaults: logData,
      });
    }

    console.log('✅ Тестовые логи созданы для localhost');

    // Создаем тестовые логи для продакшен компании
    const productionLogs = [
      {
        username: 'admin',
        success: true,
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (Production Browser)',
        companyId: productionCompany[0].id,
      },
    ];

    for (const logData of productionLogs) {
      await Log.findOrCreate({
        where: {
          username: logData.username,
          companyId: logData.companyId,
          timestamp: new Date(),
        },
        defaults: logData,
      });
    }

    console.log('✅ Тестовые логи созданы для production');

    // Создаем метапользователя для админки
    await MetaUser.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        username: 'admin',
        password: 'qwerty', // В реальном проекте здесь должен быть хеш
      },
    });

    console.log('✅ Метапользователь создан');

    console.log('🎉 База данных успешно инициализирована!');
    console.log('');
    console.log('📋 Доступные данные:');
    console.log('- Development: Test Company (localhost)');
    console.log('- Production: Just Created Site (justcreatedsite.ru)');
    console.log('- Логин для компаний: admin / qwerty123');
    console.log('- Логин для метаадминки: admin / qwerty');
    console.log('');
  } catch (error) {
    console.error('❌ Ошибка при инициализации базы данных:', error);
    throw error;
  }
};
