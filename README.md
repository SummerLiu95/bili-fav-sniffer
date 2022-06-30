# my-you-get

构建镜像.

```bash
$ docker build -t bili .
```

运行镜像.

```bash
# 前台运行, 结束后删除该容器.
$ docker run --rm bili
# 后台运行, 结束后删除该容器.
$ docker run --rm -d bili
# 调试镜像.
$ docker run -it --rm bili /bin/bash
```
