import type { NextApiRequest, NextApiResponse } from 'next'
import { Data } from '@/const';
import { IncomingForm } from 'formidable'
import { readFileSync } from 'node:fs';

// // 关闭next默认的bodyParser处理方式
export const config = {
    api: {
        bodyParser: false,
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error(err);
            res.statusMessage = 'Internal Server Error';
            res.status(500).end();
        } else {
            // 获取JSON文件内容
            const jsonContent = readFileSync((files.file as any).filepath, 'utf8');
            const result = JSON.parse(jsonContent);
            res.status(200).json({ msg: 'File uploaded successfully', data: result });
        }
    });
}
