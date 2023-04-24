import { ReplyCacheModel } from '../../db';
import sequelize from '../../db/sequelize';
import ReplyCache from '../replyCache';

describe('ReplyCache model', () => {
  beforeAll(async () => {
    await sequelize.sync();
  });

  beforeEach(async () => {
    ReplyCacheModel.destroy({
      where: {}
    })
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('can read all records', async () => {
    await ReplyCache.saveCache(
       '1',
      '1',
      'Record 1',
      null,
      new Date()
    );
    await ReplyCache.saveCache(
      '2',
     '2',
     'Record 2',
     null,
     new Date());

    const allRecords = await ReplyCache.findAll();

    expect(allRecords).toHaveLength(2);
  });
  
  it('can create a new record', async () => {
    await ReplyCache.saveCache(
      '1',
      '1',
      'Record 1',
      null,
      new Date()
   );
    const newRecord = await ReplyCache.getCache(
      '1',
      '1'
    );
    expect(newRecord.input).toBe('Record 1');
  });

  it('can update an existing record', async () => {
    const newRecord = await ReplyCache.saveCache('3',
    '3',
    'Record 3',
    null,
    new Date());

    const updatedRecord = await newRecord.update({
      reply: 'Updated message',
    });

    expect(updatedRecord.reply).toBe('Updated message');
  });

  it('can delete an existing record', async () => {
    const newRecord = await ReplyCache.saveCache(
    '1',
    '1',
    'Record 1',
    null,
    new Date()
    );

    await newRecord.destroy();

    const allRecords = await ReplyCache.findAll();

    expect(allRecords).toHaveLength(0);
  });
});
