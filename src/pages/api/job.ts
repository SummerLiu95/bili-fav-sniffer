// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {spawn} from 'node:child_process';
import {existsSync, writeFileSync} from 'node:fs'
import {Job} from 'node-schedule';
import {Data} from '@/const';
import bodyParser from 'body-parser';

const jsonParser = bodyParser.json();

let job = new Job('sniffer shell', function () {
    const child = spawn('/bin/bash', ['/app/sniffer.sh']);

    //将子进程的标准输出流附加到父进程的流中
    child.stdout.pipe(process.stdout);

    //将子进程的标准错误流附加到父进程的流中
    child.stderr.pipe(process.stderr);
});

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === 'POST') {
        jsonParser(req, res, function () {
            const config = {
                telegram_bot_token: req.body['telegram_bot_token'] || '',
                telegram_chat_id: req.body['telegram_chat_id'] || '',
                uid: req.body['uid'],
                fid: req.body['fid'],
                rss_domain: req.body['rss_domain'],
                cron: req.body['cron'],
                cookies: req.body['cookies'] || ''
            }
            writeFileSync('/app/config.json', JSON.stringify(config, null, 2))
            writeFileSync('/app/cookies.txt', config.cookies);
            if (!existsSync('/app/BV.txt')) {
                writeFileSync('/app/BV.txt', '');
            }
            if (job.nextInvocation()) {
                if (job.reschedule(config.cron)) {
                    res.status(200).json({
                        msg: '更新任务成功',
                        data: {nextInvocationTime: `${job.nextInvocation()}`}
                    });
                } else {
                    res.statusMessage = '更新任务失败';
                    res.status(500).end();
                }
            } else {
                if (job.schedule(config.cron)) {
                    res.status(200).json({
                        msg: '开启任务成功',
                        data: {nextInvocationTime: `${job.nextInvocation()}`}
                    });
                } else {
                    res.statusMessage = '开启任务失败';
                    res.status(500).end();
                }
            }

        })
    } else if (req.method === 'DELETE') {
        if (job.nextInvocation()) {
            if (job.cancel(false)) {
                res.status(200).json({
                    msg: '终止任务运行成功',
                    data: {nextInvocationTime: ''}
                })
            } else {
                res.statusMessage = '终止任务运行失败';
                res.status(500).end();
            }
        }
    } else if (req.method === 'GET') {
        if (job.nextInvocation()) {
            const nextInvocationTime = job.nextInvocation();
            res.status(200).json({
                msg: '成功获取下次执行时间',
                data: {nextInvocationTime: `${nextInvocationTime}`}
            })
        } else {
            res.status(200).json({
                msg: '未有在运行的任务，因此获取下次执行时间失败',
                data: {nextInvocationTime: ''}
            })
        }
    }
}
