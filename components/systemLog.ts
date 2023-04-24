import {SystemLogModel} from '../db';

export class SystemLog {
    getLatestLogs=()=> {
      return SystemLogModel.findAll({order: [['createdAt', 'DESC']], limit: 100});
    };
    createLog = (level: string, message: string) =>{
      const newRecord = SystemLogModel.create({
        message: message,
        level: level
      });
      return newRecord;
    };
    findAll = () => SystemLogModel.findAll();
}

export default new SystemLog();