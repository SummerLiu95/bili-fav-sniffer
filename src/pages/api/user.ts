import type {NextApiRequest, NextApiResponse} from 'next'
import {Data} from '@/const';
import fetch from 'node-fetch';
import {setCookieHeader} from '@/pages/api/login';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === 'GET') {
        const response = await fetch('https://api.bilibili.com/x/web-interface/nav', {
            headers: {
                'Cookie': setCookieHeader // 设置 Cookie 值
            }
        });
        if (response.ok) {
            const data = await response.json() as { data: { isLogin: boolean; } };
            res.status(200).json({msg: 'success', data: data.data});
        } else {
            res.statusMessage = '获取用户信息失败';
            res.status(500).end();
        }
    }
}
