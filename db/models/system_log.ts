import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';

export class SystemLogModel extends Model {
  id!: number;
  level!: 'error' | 'warn' | 'info' | 'debug' | null;
  fromusername!: string | null;
  tousername!: string | null;
  message!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
}
SystemLogModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id"
    },
    level: {
      type: DataTypes.ENUM('error', 'warn', 'info', 'debug'),
      allowNull: true,
      defaultValue: null,
      field: "level"
    },
    fromusername: {
      type: DataTypes.STRING(64),
      allowNull: true,
      field: "fromusername"
    },
    tousername: {
      type: DataTypes.STRING(64),
      allowNull: true,
      field: "tousername"
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      field: "message"
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: "createdAt"
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: "updatedAt"
    }
  },
  {
    modelName: "SystemLog",
    tableName: "systemlogs",
    timestamps: true,
    sequelize
  }
);

export default SystemLogModel