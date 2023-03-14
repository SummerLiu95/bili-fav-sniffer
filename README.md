<div align=center>
<img src="https://picbed-1253377077.cos.ap-guangzhou.myqcloud.com/img/202302121317373.png" width="300" height="300"/>
</div>

# bili-fav-sniffer
相信大家都会有一个困惑（特别是作为一名住在 B 站的程序员来说🤣）：收藏好的 B 站视频失效无法观看，觉得可太可惜了。此时这个工具就是为解决这种情况而诞生的。它会定期检测某个特定收藏夹是否有新收藏但未下载的视频，如果有即下载新收藏的视频。

**建议该服务运行在有科学冲浪环境的软路由或 VPS 中，因为 RSSHub 服务在国内直连有较大概率失败（当然 RSSHub 服务也可以自己本地部署）**。
![](https://picbed-1253377077.cos.ap-guangzhou.myqcloud.com/img/202303111755903.png)

## 使用运行
```bash
docker run
  --platform linux/amd64     # 根据自己的平台二选一，linux/amd64 或者 linux/arm64
  --name ${nameOfContainer} 
  -p 3000:3000               # 这里的主机端口可以自定义
  -v ${yourPathToRequiredDir}:/usr/you-get-download  
  fish95/bili-fav-sniffer 
```
然后打开配置页面地址填写必要信息即可开启嗅探服务～

## 主要功能
- 嗅探新收藏视频（第一次会将最近收藏的20条视频下载，后续运行只会下载新收藏视频）
- 某次运行下载未成功视频会在下次运行中重新尝试直到成功下载为止
- 可以随时控制任务的停止开启以及运行时间
- 通知推送
- 最高可以下载视频的最高分辨率视频（需要填入cookies）
- 下载收藏的视频时可以下载封面和弹幕


## DockerHub 镜像地址
[fish95/bili-fav-sniffer](https://hub.docker.com/r/fish95/bili-fav-sniffer)

## To-Do
- [x] 配置文件
- [x] 多个新收藏视频下载
- [x] 修复视频下载是否成功得判断逻辑
- [x] 调整视频下载顺序，保持跟收藏夹顺序一致
- [ ] 对 xml 弹幕转换成 srt
- [x] 镜像瘦身
- [x] 动态定义 cron
- [ ] 多收藏夹嗅探服务（容器）集群运行
- [x] 多系统架构支持（linux/amd64, linux/arm64)
- [ ] 推送消息方式的增加和选择
- [x] 增加用户配置界面，以及定时服务的控制功能
- [x] 进入配置页面读取最近的配置参数
- [ ] 页面增加服务的运行控制台展示或者日志输出（容器Web Console技术实现）
- [ ] 解决潜在的用户权限问题
- [ ] 解决文件夹命名乱码问题（可能是由于符号问题，例如空格、?、*、$ 等。最好使用字母、数字、下划线和连字符）
- [ ] 考虑用户扫码登入bili账号下载会员清晰度视频
- [ ] 考虑接入bili官方收藏夹接口替换 RssHub

## 使用须知

获取cookies需要用到一个Chrome插件：[EditThisCookie](https://chrome.google.com/webstore/detail/editthiscookie/fngmhnnpilhplaeedifhccceomclgfbg)，以 Netscape HTTP Cookie File 方式导出文本并复制到配置页面的 cookies 输入框

## 本地开发调试
```bash
# 本地构建镜像
docker build -t bili-fav-sniffer .

# 前台运行, 结束后删除该容器.
docker run --rm --name ${nameOfContainer} -p 3000:3000 -v ${specifiedVideoDownloadDir}:/usr/you-get-download bili-fav-sniffer

# 后台运行, 结束后删除该容器.
docker run --rm -d --name ${nameOfContainer} -p 3000:3000 -v ${specifiedVideoDownloadDir}:/usr/you-get-download bili-fav-sniffer

# 调试镜像.
docker run -it --rm -p 3000:3000 -v ${specifiedVideoDownloadDir}:/usr/you-get-download bili-fav-sniffer /bin/bash
```

## 参考资料
[自动下载B站收藏视频](https://blog.left.pink/archives/3073)\
[社交媒体-bilibili up主非默认收藏夹｜RSSHub](https://docs.rsshub.app/social-media.html#bilibili-up-zhu-fei-mo-ren-shou-cang-jia)\
[Telegram 创建 bot 获取 token 和 chatID 以及发送消息简明教程](https://hellodk.cn/post/743)

## 感谢
[Left024/BiliFavoritesDownloader](https://github.com/Left024/BiliFavoritesDownloader)\
[you-get](https://github.com/soimort/you-get)\
[FFmpeg](https://github.com/FFmpeg/FFmpeg)\
[RSSHub](https://github.com/DIYgod/RSSHub)

