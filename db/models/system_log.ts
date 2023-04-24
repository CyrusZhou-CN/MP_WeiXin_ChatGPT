import { Sequelize, DataTypes } from 'sequelize';
export default function (sequelize: Sequelize) {
  const attributes = {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      comment: undefined,
      field: "id"
    },
    level: {
      type: DataTypes.ENUM('error', 'warn', 'info', 'debug'),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: undefined,
      field: "level"
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: undefined,
      field: "message"
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      primaryKey: false,
      autoIncrement: false,
      comment: undefined,
      field: "createdAt"
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      primaryKey: false,
      autoIncrement: false,
      comment: undefined,
      field: "updatedAt"
    }
  };
  const options = {
    tableName: "system_log",
    comment: "",
    indexes: []
  };
  const SystemLogModel = sequelize.define("system_log_model", attributes, options);
  return SystemLogModel;
}