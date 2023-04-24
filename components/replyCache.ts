import {ReplyCacheModel} from '../db';

export class ReplyCache {
    getCache= (msgId: string, responseId: string)=> {
        const catche = ReplyCacheModel.findOne({where:{msgId:msgId, responseId:responseId}});
        return catche;
    };
    saveCache=(msgId: string, responseId: string, input: string|null, reply: string|null,expireAt: Date)=> {
        const catche =  ReplyCacheModel.create({msgId:msgId, responseId:responseId, input:input, reply:reply,expireAt:expireAt});
        return catche;
    };
    findAll = () => ReplyCacheModel.findAll();
}

export default new ReplyCache();