import type {NextApiRequest, NextApiResponse} from 'next'
import {Data} from '@/const';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import transformNetscapeCookies from '@/utils/transform-netscape-cookies';
import {promises as fs} from 'node:fs';

const jsonParser = bodyParser.json();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === 'GET') {
        const response = await fetch('https://passport.bilibili.com/x/passport-login/web/qrcode/generate');
        if (response.ok) {
            const data = await response.json() as { data: { url: string; qrcode_key: string } };
            res.status(200).json({msg: 'success', data: data.data});
        } else {
            res.statusMessage = '获取二维码失败';
            res.status(500).end();
        }
    } else if (req.method === 'POST') {
        try {
            jsonParser(req, res, async function () {
                const url = `https://passport.bilibili.com/x/passport-login/web/qrcode/poll?qrcode_key=${req.body['qrcode_key']}`
                const response = await fetch(url);
                const data = await response.json() as {
                    code: number;
                    data: { code: number; refresh_token: string }
                };
                if (!data.code) {
                    if (data.data.code === 0) {
                        const headers = response.headers;
                        const setCookieHeader = headers.get('set-cookie') as string;
                        const regex = /Expires=([^;]+GMT[;,]?)/g;
                        const cookies = setCookieHeader.replace(regex, (match, expiresValue) => {
                            const expiresTimestamp = new Date(expiresValue).getTime() / 1000;
                            let symbol = ''
                            if(expiresValue.endsWith('GMT;') || expiresValue.endsWith('GMT,')) {
                                symbol = expiresValue.slice(-1);
                            }
                            return `Expires=${expiresTimestamp}${symbol}`;
                        });
                        const cookiesArray = cookies.split(',').map(str => str.trim());
                        await fs.writeFile('/app/cookies.txt', transformNetscapeCookies(cookiesArray));
                    }
                    res.status(200).json({msg: '成功请求', data: data.data});
                }
            });
        } catch (e) {
            res.statusMessage = '请求 bili getLoginInfo 失败';
            res.status(500).end();
        }
    }
}
