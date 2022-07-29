# my-you-get

构建镜像.

```bash
$ docker build -t bili .
```

运行镜像.

```bash
# 前台运行, 结束后删除该容器.
$ docker run --rm -v /mnt/sda/storage/Music_Learning:/root/download bili
# 后台运行, 结束后删除该容器.
$ docker run --rm -d -v /mnt/sda/storage/Music_Learning:/root/download bili
# 调试镜像.
$ docker run -it --rm -v /mnt/sda/storage/Music_Learning:/root/download bili /bin/bash
```
