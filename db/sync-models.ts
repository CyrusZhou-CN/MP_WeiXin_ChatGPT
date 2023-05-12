
import sequelize from './sequelize';
import SystemLogModel from './models/system_log';
import ReplyCacheModel from './models/reply_cache';
import SequelizeAdapter from '@next-auth/sequelize-adapter';
import User from './models/user';
import { hash } from 'bcrypt';

const syncModels = async (): Promise<void> => {
  await ReplyCacheModel.sync({ force: false });
  await SystemLogModel.sync({ force: false });
  await User.sync({ force: false });
  SequelizeAdapter(sequelize);
  await sequelize.sync({ force: false });
  // Create default admin user
  const adminUser = await User.findOne({ where: { username: 'admin' } });
  if (!adminUser) {
    const hashedPassword = await hash('admin', 10);
    await User.create({ username: 'admin',name: 'Admin', email: 'admin@example.com', password: hashedPassword });
  }
};

export default syncModels;
