// index.ts
import sequelize from './sequelize';
import defineSystemLogModel from './models/system_log';
import defineReplyCacheModel from './models/reply_cache';

const SystemLogModel = defineSystemLogModel(sequelize);
const ReplyCacheModel = defineReplyCacheModel(sequelize);

// sequelize.sync({ force: true }).then(() => {
//     console.log('数据库同步成功');
// }).catch((err) => {
//     console.error('数据库同步失败:',err);
// });

export { SystemLogModel, ReplyCacheModel };
