FROM python:3

COPY cronjobs /etc/cron.d/root

ENV DEBIAN_FRONTEND=noninteractive
RUN apt update && \
    apt install -y python3-pip cron git && \
    python3 -m pip install you-get && \
    rm -rf /var/lib/apt/lists/* && \
    chmod +x /etc/cron.d/* && \
    git clone https://github.com/Left024/BiliFavoritesDownloader /root/bili

CMD ["cron", "-f"]
