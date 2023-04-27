// sequelize.ts
import { Dialect, Sequelize } from 'sequelize';
import sysconfig from '../components/sysconfig';
import writeToFile from '../components/log';

// 创建 Sequelize 实例并传递连接参数
const dialect:Dialect=sysconfig.dbType as Dialect;

let sequelize = new Sequelize({
    host: sysconfig.dbHost,
    username: sysconfig.dbUserName,
    password: sysconfig.dbPassword,
    database: sysconfig.dbDatabase,
    port: sysconfig.dbPort,
    dialect: dialect,
  });
// 导出 sequelize 实例
export default sequelize;