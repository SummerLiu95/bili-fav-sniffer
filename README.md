<div align=center>
<img src="https://picbed-1253377077.cos.ap-guangzhou.myqcloud.com/img/202302121317373.png" width="300" height="300"/>
</div>

# bili-fav-sniffer
相信大家都会有一个困惑（特别是作为一名住在 B 站的程序员来说🤣）：收藏好的 B 站视频失效无法观看，觉得可太可惜了。此时这个工具就是为解决这种情况而诞生的。它会定期（目前固定为每天 10 点和 19 点运行服务，后期会增加配置项让用户选择运行时间）在某个特定收藏夹下载新收藏的视频。

**建议该服务跑在能够有科学冲浪环境的软路由或 VPS 中，因为 RSSHub 服务在国内直连有较大概率失败（当然 RSSHub 服务也可以自己本地部署）**。

![服务通知展示](https://picbed-1253377077.cos.ap-guangzhou.myqcloud.com/img/202302110013607.jpg)
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
- [ ] 动态定义 cron
- [ ] 多收藏夹嗅探服务（容器）集群运行
- [ ] 多系统架构支持
- [ ] 推送消息方式的增加和选择
- [ ] 增加用户配置界面，以及定时服务的控制功能

## 使用须知
使用前需要在 docker 宿主机创建一个目录，该目录下创建两个运行必备文件，`config.json`、`BV.txt`。还有一个非必备文件`cookies.txt`，该文件可以帮助下载对应bilibili账号可观看的最高分辨率视频，主要针对的是会员帐号。
### config.json
```json
{
  "telegram_bot_token": "TG 机器人 token值",
  "telegram_chat_id": "TG 机器人 chat id",
  "uid": "bilibili 用户 id",
  "fid": "bilibili 收藏夹 id",
  "rssDomain": "RSS 服务地址，如果非自建部署 RSSHub 服务，则可以配置 https://rsshub.app"
}
```
上述配置参数为必须配置的参数，否则影响脚本正常运行。参数值的获取方法可阅读[参考资料](https://github.com/BarryLiu1995/bili-fav-sniffer#%E5%8F%82%E8%80%83%E8%B5%84%E6%96%99)的文档
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
[社交媒体-bilibili up主非默认收藏夹｜RSSHub](https://docs.rsshub.app/social-media.html#bilibili-up-zhu-fei-mo-ren-shou-cang-jia)\
[Telegram 创建 bot 获取 token 和 chatId 以及发送消息简明教程](https://hellodk.cn/post/743)

## 感谢
[Left024/BiliFavoritesDownloader](https://github.com/Left024/BiliFavoritesDownloader)\
[you-get](https://github.com/soimort/you-get)\
[FFmpeg](https://github.com/FFmpeg/FFmpeg)\
[RSSHub](https://github.com/DIYgod/RSSHub)

