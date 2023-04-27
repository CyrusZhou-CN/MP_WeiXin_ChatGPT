import { Sequelize, DataTypes } from 'sequelize';
export default function (sequelize: Sequelize) {
  const attributes = {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      comment: undefined,
      field: "id"
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
    msgId: {
      type: DataTypes.STRING(64),
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
      comment: undefined,
      field: "msgId"
    },
    responseId: {
      type:  DataTypes.STRING(64),
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
      comment: undefined,
      field: "responseId"
    },
    input: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
      comment: undefined,
      field: "input"
    },
    reply: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: undefined,
      field: "reply"
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
    },
    expireAt: {
      type: DataTypes.DATE,
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
      comment: undefined,
      field: "expireAt"
    }
  };
  const options = {
    tableName: "reply_cache",
    comment: "",
    indexes: []
  };
  const ReplyCacheModel = sequelize.define("reply_cache", attributes, options);
  return ReplyCacheModel;
}