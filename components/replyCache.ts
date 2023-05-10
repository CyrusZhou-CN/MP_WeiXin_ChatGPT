import { ReplyCacheModel } from '../db/models';
export class ReplyCache {
    
    getCacheForResponseId = (responseId: string) => {
        const catche = ReplyCacheModel.findOne({ where: { responseId: responseId }, order: [['id', 'ASC']] });
        return catche;
    };
    getCacheForMsgId = (msgId: string) => {
        const catche = ReplyCacheModel.findOne({ where: { msgId: msgId }, order: [['id', 'ASC']] });
        return catche;
    };
    getCacheForId = (Id: number) => {
        return ReplyCacheModel.findOne({ where: { id: Id }});
    };
    saveCache = (fromusername: string, tousername: string, msgId: string, responseId: string, input: string | null, reply: string | null, expireAt: Date) => {
        const catche = ReplyCacheModel.create({ fromusername: fromusername, tousername: tousername, msgId: msgId, responseId: responseId, input: input, reply: reply, expireAt: expireAt });
        return catche;
    };
    findAll = () => ReplyCacheModel.findAll();
}

export default new ReplyCache();