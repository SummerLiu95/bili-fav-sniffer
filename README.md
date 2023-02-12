# bili-fav-sniffer
相信大家都会有一个困惑（特别是作为一名住在 B 站的程序员来说🤣）：收藏好的 B 站视频失效无法观看，可觉得太可惜了。此时这个工具就是为解决这种情况而诞生的。它会定期在某个特定收藏夹下载新收藏的视频。
## 本地构建镜像
```bash
$ docker build -t bili-fav-sniffer .
```
## DockerHub 镜像地址
[fish95/bili-fav-sniffer](https://hub.docker.com/r/fish95/bili-fav-sniffer)

## To-Do
- [x] 配置文件
- [x] 多个新收藏视频下载
- [x] 修复视频下载是否成功得判断逻辑
- [x] 调整视频下载顺序，保持跟收藏夹顺序一致
- [ ] 对 xml 弹幕转换成 srt
- [x] 镜像瘦身

## 使用须知
使用前需要创建一个目录，该目录下创建三个运行必备文件，`config.json`、`BV.txt`、`cookies.txt`
### config.json
```json
{
  "telegram_bot_token": "TG 机器人 token值",
  "telegram_chat_id": "TG 机器人 chat id",
  "uid": "bilibili 用户 id",
  "fid": "bilibili 收藏夹 id",
  "rssDomain": "RSS 服务地址，可以使用 https://rsshub.app"
}
```
上述配置参数可阅读参考链接获取
### BV.txt
该文件用来存储已下载过的视频的 BV 值
```text
BV1QT411Z7F4
BV1wY411V7yW
......
BV1TZ4y1t7dJ
```
### cookies.txt
```text
......
// bilibili cookie信息，用来下载 4k 清晰度视频
```
获取cookies需要用到一个Chrome插件：[EditThisCookie](https://chrome.google.com/webstore/detail/editthiscookie/fngmhnnpilhplaeedifhccceomclgfbg)，以 Netscape HTTP Cookie File 方式导出文本到 txt 文件中
## 运行镜像
```bash
# 从 docker hub 拉取镜像运行
$ docker pull --rm -d --name ${nameOfContainer} -v ${yourPathToRequiredDir}:/root/config -v ${specifiedVideoDownloadDir}:/usr/you-get-download fish95/bili-fav-sniffer

# 前台运行, 结束后删除该容器.
$ docker run --rm --name ${nameOfContainer} -v ${yourPathToRequiredDir}:/root/config -v ${specifiedVideoDownloadDir}:/usr/you-get-download bili-fav-sniffer

# 后台运行, 结束后删除该容器.
$ docker run --rm -d --name ${nameOfContainer} -v ${yourPathToRequiredDir}:/root/config -v ${specifiedVideoDownloadDir}:/usr/you-get-download bili-fav-sniffer

# 调试镜像.
$ docker run -it --rm -v ${yourPathToRequiredDir}:/root/config -v ${specifiedVideoDownloadDir}:/usr/you-get-download bili-fav-sniffer /bin/bash
```

## 参考资料
[自动下载B站收藏视频](https://blog.left.pink/archives/3073)\
[社交媒体｜RSSHub](https://docs.rsshub.app/social-media.html#bilibili)\
[Telegram 创建 bot 获取 token 和 chatId 以及发送消息简明教程](https://hellodk.cn/post/743)

## 感谢
[Left024/BiliFavoritesDownloader](https://github.com/Left024/BiliFavoritesDownloader)\
[you-get](https://github.com/soimort/you-get)\
[FFmpeg](https://github.com/FFmpeg/FFmpeg)\
[RSSHub](https://github.com/DIYgod/RSSHub)

