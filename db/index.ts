// index.ts
import sequelize from './sequelize';
import defineSystemLogModel from './models/system_log';
import defineReplyCacheModel from './models/reply_cache';

const SystemLogModel = defineSystemLogModel(sequelize);
const ReplyCacheModel = defineReplyCacheModel(sequelize);

export { SystemLogModel, ReplyCacheModel };
