FROM python:3

COPY cronjobs /etc/cron.d/my_you_get
# 把脚本运行的必备文件拷贝到 /root 目录下
COPY DanmakuFactory bili.sh cookies.txt /root/

ENV DEBIAN_FRONTEND=noninteractive
RUN mkdir /root/download && \
    chmod 777 /root/download/ && \
    apt update && \
    apt install -y python3-pip cron git && \
    python3 -m pip install you-get && \
    rm -rf /var/lib/apt/lists/* && \
    chmod +x /etc/cron.d/*

CMD ["cron", "-f"]
