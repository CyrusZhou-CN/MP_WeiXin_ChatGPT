import { SystemLogModel } from '../../db';
import sequelize from '../../db/sequelize';
import SystemLog from '../systemLog';

describe('SystemLog model', () => {
  beforeAll(async () => {
    await sequelize.sync();
  });

  beforeEach(async () => {
    SystemLogModel.destroy({
      where: {}
    })
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('can create a new record', async () => {
    const newRecord = await SystemLog.createLog('info','User logged in');

    expect(newRecord).toMatchObject({
      id: expect.any(Number),
      message: 'User logged in',
      level: 'info',
    });
  });

  it('can read all records', async () => {
    await SystemLog.createLog('info','User logged in');
    await SystemLog.createLog('debug','User logged out');

    const allRecords = await SystemLog.getLatestLogs();

    expect(allRecords).toHaveLength(2);
  });

  it('can update an existing record', async () => {
    const newRecord = await SystemLog.createLog('info','User logged in');

    const updatedRecord = await newRecord.update({
      message: 'User logged out',
      level: 'debug',
    });

    expect(updatedRecord.message).toBe('User logged out');
  });

  it('can delete an existing record', async () => {
    const newRecord = await SystemLog.createLog('info','User logged in');

    await newRecord.destroy();

    const allRecords = await SystemLog.findAll();

    expect(allRecords).toHaveLength(0);
  });
});
