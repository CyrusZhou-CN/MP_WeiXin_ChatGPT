import { Dialect, Sequelize } from 'sequelize';
import sysconfig from '../components/sysconfig';
import writeToFile from '../components/log';

// 根据配置参数设置 Sequelize 实例选项
let sequelizeOptions: any = {
  dialect: sysconfig.dbType as Dialect,
  // 设置日志选项
  logging: (msg:any) => {
    writeToFile('sequelize', msg)
  }
};
if (sysconfig.dbType === 'sqlite') {
  sequelizeOptions = {
    ...sequelizeOptions,
    storage: 'database.sqlite',
  };
} else {
  sequelizeOptions = {
    ...sequelizeOptions,
    host: sysconfig.dbHost,
    username: sysconfig.dbUserName,
    password: sysconfig.dbPassword,
    database: sysconfig.dbDatabase,
    port: sysconfig.dbPort,
  };
}

// 创建 Sequelize 实例
const sequelize = new Sequelize(sequelizeOptions);

// 导出 sequelize 实例
export default sequelize;
