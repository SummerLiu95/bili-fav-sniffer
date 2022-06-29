FROM python:3

RUN apt-get update \
    && apt-get install python3-pip \
    && pip3 install you-get