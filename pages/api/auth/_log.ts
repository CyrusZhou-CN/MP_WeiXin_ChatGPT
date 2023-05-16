import { NextApiRequest, NextApiResponse } from "next";

const log = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, query, body } = req;
    console.log(method, query, body);
    res.status(200).json({});
}
export default log