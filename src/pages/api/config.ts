import type { NextApiRequest, NextApiResponse } from 'next'
import { Data } from '@/const';
import { existsSync, readFile, writeFileSync } from 'node:fs';
import bodyParser from 'body-parser';

const jsonParser = bodyParser.json();

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === 'GET') {
        if (existsSync('/app/config.json')) {
            readFile('/app/config.json', 'utf-8', (err, data) => {
                if (err) {
                    res.statusMessage = '读取配置文件发生错误';
                    res.status(500).end();
                    return;
                }

                const obj = JSON.parse(data);
                res.status(200).json({ msg: '成功读取配置文件', data: obj })
            });
        } else {
            res.status(200).json({ msg: '配置文件还未创建', data: {} })
        }
    } else if (req.method === 'POST') {
        try {
            jsonParser(req, res, function () {
                writeFileSync('/app/cookies.txt', req.body['cookies']);
                res.status(200).json({ msg: '成功写入 cookies.txt' })
            });
        } catch (e) {
            res.statusMessage = '写入 cookies.txt 发生错误';
            res.status(500).end();
        }
    }
}
