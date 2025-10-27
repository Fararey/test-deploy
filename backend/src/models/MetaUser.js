import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const MetaUser = sequelize.define(
  'MetaUser',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'meta_users',
    timestamps: true,
  },
);

export default MetaUser;
