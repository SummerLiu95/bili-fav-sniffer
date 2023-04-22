import type { NextApiRequest, NextApiResponse } from 'next'
import { Data } from '@/const';
import { existsSync, promises as fs } from 'node:fs';
import bodyParser from 'body-parser';

const jsonParser = bodyParser.json();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === 'GET') {
        if (existsSync('/app/config.json')) {
            const obj = await fs.readFile('/app/config.json', 'utf-8');
            const cookies = await fs.readFile('/app/cookies.txt', 'utf-8');
            const config = JSON.parse(obj);
            const result = Object.assign({cookies}, config, {
                fav_url: `https://space.bilibili.com/${config.uid}/favlist?fid=${config.fid}&ftype=create`
            });
            res.status(200).json({ msg: '成功读取配置文件', data: result })
        } else {
            res.status(200).json({ msg: '配置文件还未创建', data: {} })
        }
    } else if (req.method === 'POST') {
        try {
            jsonParser(req, res, async function () {
                await fs.writeFile('/app/cookies.txt', req.body['cookies']);
                res.status(200).json({ msg: '成功写入 cookies.txt' })
            });
        } catch (e) {
            res.statusMessage = '写入 cookies.txt 发生错误';
            res.status(500).end();
        }
    }
}
