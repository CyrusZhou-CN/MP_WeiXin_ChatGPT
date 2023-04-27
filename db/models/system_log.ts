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
    fromusername: {
      type: DataTypes.STRING(64),
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
      comment: undefined,
      field: "fromusername"
    },
    tousername: {
      type: DataTypes.STRING(64),
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
      comment: undefined,
      field: "tousername"
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
  const SystemLogModel = sequelize.define("system_log", attributes, options);
  return SystemLogModel;
}