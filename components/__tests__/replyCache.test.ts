import sequelize from '../../db/sequelize';
import ReplyCache from '../replyCache';
import {ReplyCacheModel} from '../../db/models/reply_cache';

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
      '11111',
      '2222',
      '1',
      '1',
      'Record 1',
      null,
      new Date()
    );
    await ReplyCache.saveCache(
      '11111',
      '2222',
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
      '11111',
      '2222',
      '1',
      '1',
      'Record 1',
      null,
      new Date()
    );
    const newRecord = await ReplyCache.getCacheForResponseId(
      '1'
    );
    expect(newRecord.input).toBe('Record 1');
  });
  it('getCacheForMsgId', async () => {
    await ReplyCache.saveCache(
      '11111',
      '2222',
      '11111111',
      '1',
      'Record 1',
      null,
      new Date()
    );
    const newRecord = await ReplyCache.getCacheForMsgId(
      '11111111'
    );
    expect(newRecord?.msgId).toBe('11111111');
  });
  it('can update an existing record', async () => {
    const newRecord = await ReplyCache.saveCache('3',
      '11111',
      '2222',
      '3',
      'Record 3',
      null,
      new Date());
    const cache = await ReplyCache.getCacheForMsgId(
      '2222'
    );
    
    if (cache) {
      const ask = cache.ask + 1;
      await cache.update({ ask });
      const testcache = await ReplyCache.getCacheForId(
        cache.id
      );
      expect(testcache?.ask).toBe(ask);
    }

    const updatedRecord = await newRecord.update({
      reply: 'Updated message',
    });

    expect(updatedRecord.reply).toBe('Updated message');
  });

  it('can delete an existing record', async () => {
    const newRecord = await ReplyCache.saveCache(
      '11111',
      '2222',
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
