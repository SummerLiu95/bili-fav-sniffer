<div align=center>
<img src="https://picbed-1253377077.cos.ap-guangzhou.myqcloud.com/img/202302121317373.png" width="300" height="300"/>
</div>

# bili-fav-sniffer
相信大家都会有一个困惑（特别是作为一名住在 B 站的程序员来说🤣）：收藏好的 B 站视频失效无法观看，觉得可太可惜了。此时这个工具就是为解决这种情况而诞生的。它会定期检测某个特定收藏夹是否有新收藏但未下载的视频，如果有即下载新收藏的视频。

**建议该服务运行在有科学冲浪环境的软路由、VPS 或 NAS 等一些能够不停机的“服务器”，因为 RSSHub 服务直连有较大概率失败（当然 RSSHub 服务也可以自己本地部署来解决这个问题）**。
![](https://picbed-1253377077.cos.ap-guangzhou.myqcloud.com/img/202303111755903.png)

## 使用运行
```bash
docker run \
  --name ${nameOfContainer} \
  -p 3000:3000 \             
  -v ${yourPathToRequiredDir}:/usr/you-get-download \
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
- 视频合集下载


## DockerHub 镜像地址
[fish95/bili-fav-sniffer](https://hub.docker.com/r/fish95/bili-fav-sniffer)

## To-Do
- [x] 配置文件
- [x] 多个新收藏视频下载
- [x] 修复视频下载是否成功得判断逻辑
- [x] 调整视频下载顺序，保持跟收藏夹顺序一致
- [x] 镜像瘦身
- [x] 动态定义 cron
- [x] 多系统架构支持（linux/amd64, linux/arm64)
- [x] 增加用户配置界面，以及定时服务的控制功能
- [x] 进入配置页面读取最近的配置参数
- [x] 增加脚本执行控制台输出到日志
- [ ] 解决页面分辨率兼容问题
- [ ] 将收藏夹uid fid输入框更改为收藏夹 url 地址
- [ ] RSSHub URL 校验
- [ ] 增加控制台输出页面
- [ ] 对 xml 弹幕转换成 srt
- [ ] 推送消息方式的增加和选择
- [ ] 增加配置文件的导入导出，避免每次都需要手动填写
- [ ] 增加配置的有效性测试
- [ ] cron 易用性问题
- [ ] 解决潜在的用户权限问题

## Roadmap
- [ ] 考虑用户扫码登入bili账号下载会员清晰度视频
- [ ] 考虑接入bili官方收藏夹接口替换 RssHub

## 使用须知

获取cookies需要用到一个Chrome插件：[EditThisCookie](https://chrome.google.com/webstore/detail/editthiscookie/fngmhnnpilhplaeedifhccceomclgfbg)，以 Netscape HTTP Cookie File 方式导出文本并复制到配置页面的 cookies 输入框

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
[RSSHub](https://github.com/DIYgod/RSSHub)

## P.S.
本项目中一些代码由 ChatGPT 输出，感谢 ChatGPT 哈哈哈哈。我只是个代码黏合怪哈哈哈哈哈～


