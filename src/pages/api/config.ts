import type { NextApiRequest, NextApiResponse } from 'next'
import { Data } from '@/const';
import { existsSync, promises as fs } from 'node:fs';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === 'GET') {
        let cookies = '';
        if (existsSync('/app/config.json')) {
            const obj = await fs.readFile('/app/config.json', 'utf-8');
            if (existsSync('/app/cookies.txt')) {
                cookies = await fs.readFile('/app/cookies.txt', 'utf-8');
            }
            const config = JSON.parse(obj);
            const result = Object.assign({cookies}, config, {
                fav_url: `https://space.bilibili.com/${config.uid}/favlist?fid=${config.fid}&ftype=create`
            });
            res.status(200).json({ msg: '成功读取配置文件', data: result })
        } else {
            if (existsSync('/app/cookies.txt')) {
                cookies = await fs.readFile('/app/cookies.txt', 'utf-8');
            }
            res.status(200).json({ msg: '配置文件还未创建', data: {cookies} })
        }
    }
}
