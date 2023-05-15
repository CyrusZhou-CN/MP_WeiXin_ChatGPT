import { SystemLogModel } from '../db/models';
export class SystemLog {
    getLatestLogs=()=> {
      return SystemLogModel.findAll({order: [['createdAt', 'DESC']], limit: 100});
    };
    createLog = (fromusername: string,tousername: string,level: string, message: string) =>{
      const newRecord = SystemLogModel.create({
        fromusername: fromusername,
        tousername: tousername,
        message: message,
        level: level
      });
      return newRecord;
    };
    Log = (level: string, message: string) =>{
      const newRecord = SystemLogModel.create({
        message: message,
        level: level
      });
      return newRecord;
    };
    findAll = () => SystemLogModel.findAll();
    findById = (id: number) => SystemLogModel.findByPk(id);
}
const systemLog = new SystemLog();
export default systemLog;