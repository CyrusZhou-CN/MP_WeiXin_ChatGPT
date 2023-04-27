import {ReplyCacheModel} from '../db';

export class ReplyCache {
    getCache= (responseId: string)=> {
        const catche = ReplyCacheModel.findOne({where:{responseId:responseId},order: [['createdAt', 'DESC']]});
        return catche;
    };
    saveCache=(fromusername: string,tousername: string,msgId: string, responseId: string, input: string|null, reply: string|null,expireAt: Date)=> {
        const catche =  ReplyCacheModel.create({fromusername:fromusername,tousername:tousername,msgId:msgId, responseId:responseId, input:input, reply:reply,expireAt:expireAt});
        return catche;
    };
    findAll = () => ReplyCacheModel.findAll();
}

export default new ReplyCache();