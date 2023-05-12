import { Model, DataTypes } from 'sequelize';
import sequelize  from '../sequelize';

class User extends Model {
  declare id: string;
  declare name: string;
  declare username: string;
  declare email: string | null;
  declare password: string;
  declare emailVerified: Date | null;
  declare image: string | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: "id"
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "name"
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "username"
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "email"
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "password"
    },
    emailVerified: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "emailVerified"
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "image"
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
    sequelize,
    tableName: 'users',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: false,
  }
);

export default User;
