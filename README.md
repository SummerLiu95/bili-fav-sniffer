# my-you-get

## 构建镜像.
```bash
$ docker build -t bili .
```

## 运行镜像.
```bash
# 前台运行, 结束后删除该容器.
$ docker run --rm -v /mnt/sda/storage/Music_Learning:/root/download bili
# 后台运行, 结束后删除该容器.
$ docker run --rm -d -v /mnt/sda/storage/Music_Learning:/root/download bili
# 调试镜像.
$ docker run -it --rm -v /mnt/sda/storage/Music_Learning:/root/download bili /bin/bash
```
## To-Do
- [x] 配置文件
- [x] 多个新收藏视频下载

## 使用须知
使用前需要在项目根目录下创建一个 `config.json` 配置文件，配置字段如下：
```json
{
  "telegram_bot_token": "",
  "telegram_chat_id": "",
  "uid": "",
  "fid": "",
  "video_location": "",
  "cookies_location": "",
  "bv_location": ""
}
```

## 参考资料
[自动下载B站收藏视频](https://blog.left.pink/archives/3073)
