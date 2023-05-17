import { NextApiRequest, NextApiResponse } from "next"

const getenv = async (req: NextApiRequest, res: NextApiResponse) => {
    let pro='';
   for (let e in process.env) {
    pro+=`${e}=${process.env[e]}\n`
   } 
   res.status(200).send(pro)
}
export default getenv