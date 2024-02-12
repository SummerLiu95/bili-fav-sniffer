import type { NextApiRequest, NextApiResponse } from 'next'
import { Data } from '@/const';
import { existsSync, promises as fs } from 'node:fs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'GET') {
    if (existsSync('/app/config.json')) {
      const obj = await fs.readFile('/app/config.json', 'utf-8');
      const config = JSON.parse(obj);
      res.status(200).json({ msg: '成功返回页面标题数据', data: { page_title: config.title } });
    } else {
      res.status(200).json({ msg: '服务还未配置过'})
    }
  }
}
