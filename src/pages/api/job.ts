// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {exec} from 'node:child_process';
import {writeFileSync} from 'node:fs'
import {scheduleJob, rescheduleJob, cancelJob, Job} from 'node-schedule';
import {Data} from '@/const';
import bodyParser from 'body-parser';

const jsonParser = bodyParser.json();

let job: Job | undefined = undefined;

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === 'POST') {
        jsonParser(req, res, function () {
            try {
                const config = {
                    telegram_bot_token: req.body['telegram_bot_token'] || '',
                    telegram_chat_id: req.body['telegram_chat_id'] || '',
                    uid: req.body['uid'],
                    fid: req.body['fid'],
                    rss_domain: req.body['rss_domain'],
                    cron: req.body['cron'],
                    cookies: req.body['cookies'] || ''
                }
                let resMsg;
                writeFileSync('/app/config.json', JSON.stringify(config, null, 2))
                writeFileSync('/app/cookies.txt', config.cookies);
                writeFileSync('/app/BV.txt', '');
                if (job) {
                    rescheduleJob(job, config.cron);
                    resMsg = '成功更新任务';
                } else {
                    job = scheduleJob(config.cron, function () {
                        exec('/app/sniffer.sh')
                    })
                    resMsg = '成功开启任务';
                }
                const nextInvocationTime = job.nextInvocation();
                res.status(200).json({msg: resMsg, code: 200, data: {nextInvocationTime: `${nextInvocationTime}`}})
            } catch (e) {
                res.status(200).json({msg: `任务${job ? '更新' : '创建'}失败：${e}`, code: 500});
            }
        })
    } else if (req.method === 'GET') {
        try {
            if (job) {
                cancelJob(job as Job);
                res.status(200).json({msg: '成功结束任务', code: 200})
            } else {
                res.status(200).json({msg: '未有在运行的任务，因此结束任务失败', code: 200})
            }
        } catch (e) {
            res.status(200).json({msg: `任务结束失败：${e}`, code: 500});
        }
    }
}
