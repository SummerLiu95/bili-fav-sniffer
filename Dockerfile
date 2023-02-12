FROM python:3-alpine

COPY cronjobs /var/spool/cron/crontabs/root
# 把脚本运行的必备文件拷贝到 /root 目录下
COPY index.sh /root/

RUN sed -i "s/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g" /etc/apk/repositories && \
    apk update && \
    apk upgrade && \
    apk add --no-cache curl bash py3-pip jq ffmpeg tzdata && \
    cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Shanghai/Asia" > /etc/timezone && \
    rm -rf /var/cache/apk/* && \
    /bin/bash && \
    python3 -m pip install you-get

CMD ["mkdir", "/usr/you-get-download"]
CMD ["crond", "-f"]
