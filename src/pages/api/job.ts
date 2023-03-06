// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { exec } from 'node:child_process';
import { writeFileSync } from 'node:fs'
import { scheduleJob, rescheduleJob, cancelJob, Job } from 'node-schedule';
import { Data } from '@/const/index';

let job: Job | undefined = undefined;

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === 'POST') {
        const config = {
            telegram_bot_token: req.body['token'] || '',
            telegram_chat_id: req.body['chat_id'] || '',
            uid: req.body['uid'],
            fid: req.body['fid'],
            rssDomain: req.body['rss_domain'],
            cron: req.body['cron']
        }
        writeFileSync('/app/config.json', JSON.stringify(config, null, 2))
        writeFileSync('/app/cookies.txt', req.body['cookies']);
        writeFileSync('/app/BV.txt', '');
        if (job) {
            rescheduleJob(job, req.body['cron'])
            res.status(200).json({ msg: '成功更新任务', code: 200 });
        } else {
            job = scheduleJob(req.body['cron'], function () {
                exec('/app/sniffer.sh')
            })
            res.status(200).json({ msg: '成功开启任务', code: 200 })
        }
    } else if (req.method === 'GET') {
        if (job) {
            cancelJob(job as Job);
            res.status(200).json({ msg: '成功结束任务', code: 200 })
        } else {
            res.status(200).json({ msg: '结束任务发生错误', code: 500 })
        }
    }
}
