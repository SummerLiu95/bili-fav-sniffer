import type { NextApiRequest, NextApiResponse } from 'next'
import {ConnectionType, Data} from '@/const';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

const jsonParser = bodyParser.json();


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    jsonParser(req, res, async () => {
        if (req.body['type'] === ConnectionType.RSS) {
            try {
                const response = await fetch(req.body['url']);
                if (response.ok) {
                    res.status(200).json({msg: 'RSS 地址网络联通'});
                } else {
                    res.statusMessage = 'RSS Network Error';
                    res.status(500).end();
                }
            } catch (error) {
                res.statusMessage = 'RSS Network Error';
                res.status(500).end();
            }
        } else if (req.body['type'] === ConnectionType.Tele) {
            try {
                const response = await fetch(`https://api.telegram.org/bot${req.body['telegram_bot_token']}/getChat`, {
                    method: 'POST',
                    body: JSON.stringify({
                        chat_id: req.body['telegram_chat_id'],
                    }),
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    }
                });
                if (response.ok) {
                    res.status(200).json({msg: '电报消息推送地址网络联通'});
                } else {
                    res.statusMessage = 'telegram network error';
                    res.status(500).end();
                }
            } catch (error) {
                res.statusMessage = 'telegram network error';
                res.status(500).end();
            }
        } else {
            res.status(200).json({msg: ''});
        }
    })
}
