// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { writeFileSync } from 'node:fs'
import { exec } from 'node:child_process'

type Data = {
  code: number;
  msg: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const config = {
    telegram_bot_token: req.body['token'] || '',
    telegram_chat_id: req.body['chatID'] || '',
    uid: req.body['uid'],
    fid: req.body['fid'],
    rssDomain: req.body['rss_domain']
  }
  writeFileSync('/app/config.json', JSON.stringify(config, null, 2))
  writeFileSync('/app/cookies.txt', req.body['cookies']);
  writeFileSync('/app/BV.txt', '');
  res.status(200).json({ msg: 'Create Job Successful', code: 200 })
  exec('/app/sniffer.sh')
}
