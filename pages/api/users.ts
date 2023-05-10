import { hash } from "bcrypt";
import { UserModel } from "db/models";
import { NextApiRequest, NextApiResponse } from "next";
import { Op } from "sequelize";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, query, body } = req;

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
                    { message: { [Op.like]: `%${search}%` } },
                ],
            } : {};

            try {
                const data = await UserModel.findAll({ where: where, limit: Number(limit), offset: Number(offset) });
                const total = await UserModel.count({ where });
                res.json({ data, total });
            } catch (error) {
                res.status(500).send(error);
            }
            break;
        case 'POST':
            // 创建新用户
            const {password} = body;            
            body.password = await hash(password, 10);
            UserModel.create(body)
                .then((user) => res.json(user))
                .catch((err) => res.status(500).send(err));
            break;
        case 'PUT':
            // 更新指定用户
            const { id } = query;
            UserModel.update(body, { where: { id } })
                .then(() => res.send('User updated'))
                .catch((err) => res.status(500).send(err));
            break;
        case 'DELETE':
            // 删除指定用户
            const { id: userId } = query;
            UserModel.destroy({ where: { id: userId } })
                .then(() => res.send('User deleted'))
                .catch((err) => res.status(500).send(err));
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}