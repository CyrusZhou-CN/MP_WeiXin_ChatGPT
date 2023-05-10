import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';

export class ReplyCacheModel extends Model {
  declare id: number;
  declare fromusername: string | null | undefined;
  declare tousername: string | null| undefined;
  declare msgId: string;
  declare responseId: string;
  declare input: string;
  declare reply: string | null| undefined;
  declare ask: number;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare expireAt: Date;
}

ReplyCacheModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id"
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
    msgId: {
      type: DataTypes.STRING(64),
      allowNull: false,
      field: "msgId"
    },
    responseId: {
      type:  DataTypes.STRING(64),
      allowNull: false,
      field: "responseId"
    },
    input: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "input"
    },
    reply: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      field: "reply"
    },
    ask: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "ask"
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
    },
    expireAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "expireAt"
    },
  },
  {
    sequelize: sequelize,
    modelName: 'ReplyCache',
    tableName: 'reply_cache',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: false,
  }
);

export default ReplyCacheModel