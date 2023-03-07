import type { NextApiRequest, NextApiResponse } from 'next'
import { Data } from '@/const';
import { existsSync, readFile } from 'node:fs';


export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (existsSync('/app/config.json')) {
        readFile('/app/config.json', 'utf-8', (err, data) => {
            if (err) {
                res.status(200).json({ msg: '读取配置文件发生错误', code: 500 })
                return;
            }

            const obj = JSON.parse(data);
            res.status(200).json({ msg: '读取配置文件发生错误', code: 500, data: obj })
        });
    } else {
        res.status(200).json({ msg: '配置文件不存在', code: 500 })
    }
}
