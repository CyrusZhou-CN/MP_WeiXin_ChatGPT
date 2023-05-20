import { hash } from "bcrypt";
import { SystemLogModel } from "../../db/models";
import { NextApiRequest, NextApiResponse } from "next";
import { Op } from "sequelize";
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../lib/session'
const systemLog = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, query, body } = req;
    if (!req.session.user) {
        res.status(401).json({error: true, message: "Unauthorized" });
        return;
    }
    switch (method) {
        case 'GET':
            // 获取所有用户数据或根据关键词搜索用户数据并进行分页
            const { page = 1, limit = 10, search = '' } = query as { page?: number, limit?: number, search?: string };
            const offset = (page - 1) * limit;
            const where = search ? {
                [Op.or]: [
                    { id: { [Op.like]: `%${search}%` } },
                    { fromusername: { [Op.like]: `%${search}%` } },
                    { tousername: { [Op.like]: `%${search}%` } },
                    { level: { [Op.like]: `%${search}%` } },
                    { message: { [Op.like]: `%${search}%` } },
                ],
            } : {};
            try {
                const data = await SystemLogModel.findAll({ where: where, limit: Number(limit), offset: Number(offset), order: [['createdAt', 'DESC']] });
                const total = await SystemLogModel.count({ where });
                res.json({ data, total });
            } catch (error) {
                res.status(500).send(error);
            }
            break;
        case 'POST':
            // 创建新数据
            const { password } = body;
            body.password = await hash(password, 10);
            SystemLogModel.create(body)
                .then((e) => res.json(e))
                .catch((err) => res.status(500).send(err));
            break;
        case 'PUT':
            // 更新指定数据
            const { id } = query;
            SystemLogModel.update(body, { where: { id } })
                .then(() => res.send('Data updated'))
                .catch((err) => res.status(500).send(err));
            break;
        case 'DELETE':
            // 删除指定数据
            const { id: dataId } = query;
            SystemLogModel.destroy({ where: { id: dataId } })
                .then(() => res.send('Data deleted'))
                .catch((err) => res.status(500).send(err));
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}

export default withIronSessionApiRoute(systemLog, sessionOptions)