import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';

export class SystemLogModel extends Model {
  declare id: number;
  declare level: 'error' | 'warn' | 'info' | 'debug' | null;
  declare fromusername: string | null;
  declare tousername: string | null;
  declare message: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
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
    sequelize: sequelize,
    modelName: "SystemLog",
    tableName: "system_log",
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: false,
  }
);

export default SystemLogModel