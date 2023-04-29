import ReplyCacheModel from "../db/models/reply_cache";

export class ReplyCache {
    
    getCacheForResponseId = (responseId: string) => {
        const catche = ReplyCacheModel.findAll({ where: { responseId: responseId }, order: [['createdAt', 'DESC']] });
        return catche;
    };
    getCacheForMsgId = (msgId: string) => {
        const catche = ReplyCacheModel.findAll({ where: { msgId: msgId }, order: [['createdAt', 'DESC']] });
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