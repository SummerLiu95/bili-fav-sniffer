import { appendFileSync, existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { BV_Record_Path, Video_Downloaded_Path } from '@/const';

// 用于检测下载目录中是否已有下载视频，并将 BV 号记录到 BV.txt 文件中从而在检测中跳过
export default function () {
  const folders = readdirSync(Video_Downloaded_Path);
  for (const folder of folders) {
    if (folder.startsWith('.')) {
      continue;
    }
    const path = `${Video_Downloaded_Path}${folder}`;
    if (!existsSync(path)) {
      continue;
    }
    const stat = statSync(path);
    if (stat.isFile()) {
      continue;
    }
    const downloadedFiles = readdirSync(path);
    const hasMp4 = downloadedFiles.some(file => file.endsWith('.mp4'));
    const hasNFO = downloadedFiles.some(file => file === 'video.nfo');
    if (hasNFO && hasMp4) {
      const data = readFileSync(`${path}/video.nfo`, 'utf-8');
      const regex = /<id>(.*?)<\/id>/;
      const match = regex.exec(data) as RegExpExecArray
      appendFileSync(BV_Record_Path, `${match[1]}\n`);
    }
  }
}
