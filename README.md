<div align=center>
<img src="https://github.com/BarryLiu1995/bili-fav-sniffer/assets/20590350/d4554851-ec3a-4b8c-af7e-a81f4e59aefe" width="300" height="300"/>
</div>

# bili-fav-sniffer
相信大家都会有一个困惑（特别是作为一名住在 B 站的程序员来说🤣）：收藏好的 B 站视频失效无法观看，觉得可太可惜了。此时这个工具就是为解决这种情况而诞生的。它会定期检测某个特定收藏夹是否有新收藏但未下载的视频，如果有即下载新收藏的视频。

**建议该服务运行在有科学冲浪环境的软路由、VPS 或 NAS 等一些能够不停机的“服务器”，因为 RSSHub 服务直连有较大概率失败（当然 RSSHub 服务也可以自己本地部署来解决这个问题）**

## 使用演示
https://github.com/SummerLiu95/bili-fav-sniffer/assets/20590350/522cb8b5-13a3-425d-89d2-41e3b7e74b47


## 使用运行
dockerhub 镜像地址：[fish95/bili-fav-sniffer](https://hub.docker.com/r/fish95/bili-fav-sniffer)
```bash
docker run \
  --name ${nameOfContainer} \
  -p 3000:3000 \             
  -v ${yourPathToRequiredDir}:/usr/you-get-download \
  fish95/bili-fav-sniffer
```
然后打开配置页面地址填写必要信息即可开启嗅探服务～

## 使用须知
下载配置文件模板 [config.json](https://github.com/BarryLiu1995/bili-fav-sniffer/blob/main/template/config.json)，在配置文件将对应字段填写完毕后在配置页面选择导入配置
配置字段说明如下：
```json
{
  "telegram_bot_token": "Telegram 推送机器人 token，为选填",
  "telegram_chat_id": "Telegram 推送聊天框 id，为选填",
  "fav_url": "* 收藏夹URL，为必填字段",
  "rss_domain": "* RSSHub服务地址，为必填字段，可以选择使用默认值",
  "cron": "* cron定时表达式，为必填字段，可以选择使用默认值"
}
```

## 主要功能
- 嗅探新收藏视频（第一次运行会将收藏夹第一页的所有视频下载，后续运行只会下载新收藏视频）
- 某次运行下载未成功视频会在下次运行中重新尝试直到成功下载为止
- 可以随时控制任务的停止开启以及运行时间
- 下载结果通知推送
- 最高可以下载视频的最高分辨率视频（需扫码登录）
- 下载收藏的视频时可以下载封面和弹幕、字幕
- 支持收藏的视频合集下载
- 配置文件的导入导出，避免每次手写填入的麻烦
- 容器重启自动运行已运行的嗅探服务

## Roadmap
### v2.0.0

- [ ] 替换 rsshub
- [ ] 嗅探用户多个收藏夹，检测本地哪些视频已下载（配合刮削的 nfo 文件来实现）

### v2.1.0

- [ ] 定时服务数据持久化
- [ ] 页面 UI 风格重新改版

### v2.2.0

- [ ] 增加控制台输出页面（SSE 推送正在运行的日志输出，同时可查看以往的运行日志）

### v2.3.0

- [ ] 推送消息方式的增加
- [ ] 解决潜在的用户权限问题（权限设置最佳实践）

### 本地构建运行
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

## P.S.
本项目中一些代码由 ChatGPT 输出，感谢 ChatGPT 哈哈哈哈。我只是个代码黏合怪哈哈哈哈哈～


