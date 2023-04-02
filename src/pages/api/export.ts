import type { NextApiRequest, NextApiResponse } from 'next'
import { Data } from '@/const';
import { createReadStream, readFile } from 'node:fs';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    readFile('/app/config.json', 'utf-8', (err, data) => {
        if (err) {
            res.statusMessage = 'Internal Server Error';
            res.status(500).end();
            return;
        }

        const { telegram_bot_token, telegram_chat_id, rss_domain, cron, fid, uid } = JSON.parse(data);
        const config = {
            telegram_bot_token,
            telegram_chat_id,
            fav_url: `https://space.bilibili.com/${uid}/favlist?fid=${fid}&ftype=create`,
            rss_domain,
            cron,
        }

        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(config, null, 2));
        res.end();
    })
}
