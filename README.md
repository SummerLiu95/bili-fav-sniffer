<div align=center>

</div>

# bili-fav-sniffer
相信大家都会有一个困惑（特别是作为一名住在 B 站的程序员来说🤣）：收藏好的 B 站视频失效无法观看，觉得可太可惜了。此时这个工具就是为解决这种情况而诞生的。它会定期检测某个特定收藏夹是否有新收藏但未下载的视频，如果有即下载新收藏的视频。

**建议该服务运行在有科学冲浪环境的软路由、VPS 或 NAS 等一些能够不停机的“服务器”，因为 RSSHub 服务直连有较大概率失败（当然 RSSHub 服务也可以自己本地部署来解决这个问题）**

## 使用演示
在 NAS 中为例，演示如何使用该项目

https://user-images.githubusercontent.com/20590350/234473292-3c86f22e-7c63-4d8c-959c-a310fc546257.mp4


## 使用运行
```bash
docker run \
  --name ${nameOfContainer} \
  -p 3000:3000 \             
  -v ${yourPathToRequiredDir}:/usr/you-get-download \
  fish95/bili-fav-sniffer
```
然后打开配置页面地址填写必要信息即可开启嗅探服务～

## 使用须知

获取cookies需要用到一个Chrome插件：[EditThisCookie](https://chrome.google.com/webstore/detail/editthiscookie/fngmhnnpilhplaeedifhccceomclgfbg)，
以 Netscape HTTP Cookie File 方式导出文本并复制到配置页面的 cookies 输入框。

下载下面给的配置文件，在配置文件将对应字段填写完毕后在配置页面选择导入配置

## 配置文件模板
### 配置文件模板下载
<a href="https://github.com/BarryLiu1995/bili-fav-sniffer/blob/main/template/config.json" download="config.json">config.json</a>

### 配置文件字段说明
```json
{
  "telegram_bot_token": "Telegram 推送机器人 token，为选填",
  "telegram_chat_id": "Telegram 推送聊天框 id，为选填",
  "fav_url": "收藏夹 URL，为必须填字段",
  "rss_domain": "RSSHub 服务地址，为必须填字段，可以选择使用默认值",
  "cron": "cron 定时表达式，为必须填字段，可以选择使用默认值"
}
```

## 主要功能
- 嗅探新收藏视频（第一次运行会将收藏夹第一页的所有视频下载，后续运行只会下载新收藏视频）
- 某次运行下载未成功视频会在下次运行中重新尝试直到成功下载为止
- 可以随时控制任务的停止开启以及运行时间
- 下载结果通知推送
- 最高可以下载视频的最高分辨率视频（需要填入cookies）
- 下载收藏的视频时可以下载封面和弹幕
- 支持收藏的视频合集下载
- 配置文件的导入导出，避免每次手写填入的麻烦


## DockerHub 镜像地址
[fish95/bili-fav-sniffer](https://hub.docker.com/r/fish95/bili-fav-sniffer)

## Roadmap
- [ ] 考虑用户扫码登入bili账号下载会员清晰度视频
- [ ] 考虑接入bili官方收藏夹接口替换 RssHub
- [ ] 多收藏夹嗅探以及下载管理
- [ ] 多进程并行下载多个视频
- [ ] 推送消息方式的增加和选择
- [ ] 增加日志查看页面

## 本地构建运行
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

## 免责声明
1. 本工具仅供学习研究使用，用户在使用过程中应遵守国家法律法规，不得将本工具用于非法用途，如侵犯他人合法权益等。

2. 本工具反编译、破解或修改行为与本项目无关，使用后果自负。

3. 本工具开发者不承担任何因用户使用本工具而导致的任何形式的责任，包括但不限于因软件缺陷或操作不当导致的机器故障、数据丢失以及其它损失等。

4. 本工具不承担任何因使用本工具而产生的版权纠纷及连带责任。

5. 本工具作者拥有对本协议的最终解释权，且保留随时对项目进行修改、更新、终止的权利。

6. 如您对本工具的使用存在任何疑问，欢迎提 issue，本工具作者将在帮助解决问题的同时，并不承担因使用本工具而导致的任何形式的责任。

7. 您在下载、使用本工具以及使用本项目的过程中，即视为您已经仔细阅读并完全同意本声明的所有条款，如有异议，请立即停止使用本工具。

## 参考资料
[自动下载B站收藏视频](https://blog.left.pink/archives/3073)\
[社交媒体-bilibili up主非默认收藏夹｜RSSHub](https://docs.rsshub.app/social-media.html#bilibili-up-zhu-fei-mo-ren-shou-cang-jia)\
[Telegram 创建 bot 获取 token 和 chatID 以及发送消息简明教程](https://hellodk.cn/post/743)

## 感谢
[Left024/BiliFavoritesDownloader](https://github.com/Left024/BiliFavoritesDownloader)\
[you-get](https://github.com/soimort/you-get)\
[FFmpeg](https://github.com/FFmpeg/FFmpeg)\
[RSSHub](https://github.com/DIYgod/RSSHub)\
[hihkm/DanmakuFactory](https://github.com/hihkm/DanmakuFactory)

## P.S.
本项目中一些代码由 ChatGPT 输出，感谢 ChatGPT 哈哈哈哈。我只是个代码黏合怪哈哈哈哈哈～


