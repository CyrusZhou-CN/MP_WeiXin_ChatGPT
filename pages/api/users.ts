import { hash } from "bcrypt";
import { User } from "../../db/models";
import { NextApiRequest, NextApiResponse } from "next";
import { Op } from "sequelize";
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../lib/session'
const userRoute = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, query, body } = req;
    if (!req.session.user) {
        res.status(401).json({ error: true, message: "Unauthorized" });
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
                    { message: { [Op.like]: `%${search}%` } },
                ],
            } : {};

            try {
                const data = await User.findAll({
                    where: where,
                    limit: Number(limit),
                    offset: Number(offset),
                    attributes: { exclude: ['password'] }
                });
                const total = await User.count({ where });
                res.json({ data, total });
            } catch (error) {
                res.status(500).send(error);
            }
            break;
        case 'POST':
            // 创建新用户
            const { password } = body;
            try {
                body.password = await hash(password, 10);
            } catch (error: any) {
                res.status(500).json({ error: true, message: error.message });
                return;
            }
            try {
                const user = await User.create(body);
                // 删除密码属性并返回响应
                const userJSON = user.toJSON();
                delete userJSON.password;
                res.json({ message: 'User create', data: userJSON });
            } catch (error: any) {
                res.status(500).json({ error: true, message: error.errors[0].message })
            }
            break;
        case 'PUT':
            // 更新指定用户
            try {
                const { id, PASSWORD } = query;
                if (PASSWORD) {
                    // 修改指定用户密码
                    const { id: edit_userId } = query;
                    const { password: edit_password } = body;
                    let hashPassword = '';
                    try {
                        hashPassword = await hash(edit_password, 10);
                    } catch (error: any) {
                        res.status(500).json({ error: true, message: error.message });
                        return;
                    }
                    await User.update({ password: hashPassword }, { where: { id: edit_userId }, })
                    console.log('edit_userId:', edit_userId);
                    console.log('hashPassword:', hashPassword);
                    res.json({ message: "Password updated" });
                } else {
                    await User.update(body, { where: { id } })
                    res.json({ message: 'User updated' });
                }

            } catch (error: any) {
                console.log('PUT error:', error);
                res.status(500).json({ error: true, message: error.errors[0].message })
            }
            break;
        case 'DELETE':
            // 删除指定用户
            const { id: userId } = query;
            try {
                await User.destroy({ where: { id: userId } });
                res.json({ message: 'User deleted' });
            } catch (error: any) {
                res.status(500).json({ error: true, message: error.errors[0].message });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}

export default withIronSessionApiRoute(userRoute, sessionOptions)