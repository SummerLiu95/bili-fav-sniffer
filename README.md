# bili-fav-sniffer
相信大家都会有一个困惑（特别是作为一名住在 B 站的程序员来说🤣）：收藏好的 B 站视频失效无法观看，可觉得太可惜了。此时这个工具就是为解决这种情况而诞生的。
## 构建镜像
```bash
$ docker build -t bili-fav-sniffer .
```

## To-Do
- [x] 配置文件
- [x] 多个新收藏视频下载

## 使用须知
使用前需要创建一个目录，该目录下创建三个运行必备文件，`config.json`、`BV.txt`、`cookies.txt`
### config.json
```json
{
  "telegram_bot_token": "TG 机器人 token值",
  "telegram_chat_id": "TG 机器人 chat id",
  "uid": "bilibili 用户 id",
  "fid": "bilibili 收藏夹 id"
}
```

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

## 运行镜像
```bash
# 前台运行, 结束后删除该容器.
$ docker run --rm -v ${yourPathToRequiredDir}:/root/config -v ${specifiedVideoDownloadDir}:/usr/you-get-download bili-fav-sniffer
# 后台运行, 结束后删除该容器.
$ docker run --rm -d -v ${yourPathToRequiredDir}:/root/config -v ${specifiedVideoDownloadDir}:/usr/you-get-download bili-fav-sniffer
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

