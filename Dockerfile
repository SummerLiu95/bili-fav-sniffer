FROM python:3

COPY cronjobs /etc/cron.d/my_you_get
COPY DanmakuFactory bili.sh /root/

ENV DEBIAN_FRONTEND=noninteractive
RUN apt update && \
    apt install -y python3-pip cron git && \
    python3 -m pip install you-get && \
    rm -rf /var/lib/apt/lists/* && \
    chmod +x /etc/cron.d/*

CMD ["cron", "-f"]
