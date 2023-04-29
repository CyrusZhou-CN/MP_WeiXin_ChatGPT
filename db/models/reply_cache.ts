import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';

export class ReplyCacheModel extends Model {
  public id!: number;
  public fromusername: string | null | undefined;
  public tousername: string | null| undefined;
  public msgId!: string;
  public responseId!: string;
  public input!: string;
  public reply: string | null| undefined;
  public ask!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
  public expireAt!: Date;
}

ReplyCacheModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    fromusername: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    tousername: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    msgId: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    responseId: {
      type:  DataTypes.STRING(64),
      allowNull: false,
    },
    input: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    reply: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    ask: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    expireAt: {
      type: DataTypes.DATE,
      allowNull: false,
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