FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

# If using npm comment out above and use below instead
# RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

RUN apk update && \
    apk upgrade && \
    apk add --no-cache curl bash jq ffmpeg tzdata py3-configobj py3-pip py3-setuptools python3 python3-dev gcc g++ make git && \
    cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Shanghai/Asia" > /etc/timezone && \
    rm -rf /var/cache/apk/* && \
    /bin/bash && \
    python3 -m pip install you-get && \
    git clone https://github.com/hihkm/DanmakuFactory.git && \
    cd DanmakuFactory && \
    mkdir temp && \
    make && \
    mkdir /usr/you-get-download

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

# 设置时区变量
ENV TIME_ZONE Asia/Shanghai
# 设置 语言支持
ENV LANG=zh_CN.UTF-8
ENV LANGUAGE=zh_CN:zh

COPY --from=builder /app/public ./public
# 把脚本运行的必备文件拷贝到 /root 目录下
COPY /script/sniffer.sh /app/

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]

