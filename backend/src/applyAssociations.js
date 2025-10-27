import Company from './models/Company.js';
import Log from './models/Log.js';

export const applyAssociations = () => {
  try {
    // Определяем связи между моделями (синхронные операции)
    Company.hasMany(Log, { foreignKey: 'companyId', as: 'logs' });
    Log.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

    console.log('✅ Ассоциации между моделями применены');
  } catch (error) {
    console.error('Ошибка при применении ассоциаций:', error);
    throw error;
  }
};
