#!/bin/bash
source /etc/profile #添加这句
export PATH=/opt/homebrew/bin/:$PATH

dirLocation=$(cd `dirname $0`; pwd)
#配置参数
telegram_bot_token=$(jq -c -r .telegram_bot_token "$dirLocation"/config.json)
telegram_chat_id=$(jq -c -r .telegram_chat_id "$dirLocation"/config.json)
uid=$(jq -c -r .uid "$dirLocation"/config.json)
fid=$(jq -c -r .fid "$dirLocation"/config.json)
rss_domain=$(jq -c -r .rss_domain "$dirLocation"/config.json)
videoLocation="/usr/you-get-download/"
cookies_location="$dirLocation"/cookies.txt
bv_location="$dirLocation"/BV.txt
cookies=$(cat "$cookies_location")

favURL="https://space.bilibili.com/$uid/favlist?fid=$fid"
rssURL="$rss_domain/bilibili/fav/$uid/$fid/1"

#rss 可访问性检测
response=$(curl -I -m 10 -o /dev/null -s -w %{http_code} "$rssURL")
if [ "$response" != 200 ] && [ "$telegram_bot_token" != "" ]; then
  curl -s -X POST "https://api.telegram.org/bot$telegram_bot_token/sendMessage" -d chat_id="$telegram_chat_id" -d parse_mode=html -d text="$rssURL: RSS 访问失效"
  exit
fi

#抓取rss更新
content=$(wget "$rssURL" -q -O -)

#获取收藏夹名称和链接
favTitleSuffix=${content%%<atom:link*}
temp=${favTitleSuffix#*\[CDATA\[}
favTitle=${temp%%\]\]>*}
echo "favorites title: $favTitle"

#Cookies可用性检查
if [ "$cookies" != "" ]; then
  # Open the cookie file
  cookie_lines=$(cat "$cookies_location")

  # Find the line that contains the SESSDATA attribute
  sessdata_line=$(echo "$cookie_lines" | grep -E "SESSDATA\t")

  # Get the attribute value
  sessdata_value=$(echo "$sessdata_line" | cut -f 6 -d ' ')

  # 提取最后一部分字符串
  sessdata_value=$(echo "$sessdata_value" | awk -F'\t' '{print $NF}')

  stat=$(bilix info https://www.bilibili.com/video/BV1fK4y1t7hj --cookie "$sessdata_value")

  # 判断是否存在符合条件的行
  if echo "$stat" | grep -q "4K" && echo "$stat" | grep -A 1 "4K" | grep -q "codec"; then
    echo "cookies 在有效期内"
  else
    echo "cookies 已失效"
    curl -s -X POST "https://api.telegram.org/bot$telegram_bot_token/sendMessage" -d chat_id=$telegram_chat_id -d parse_mode=html -d text="$favTitle: Cookies 失效，请重新登陆"
    exit
  fi
fi

#获取视频列表信息
count=0
infoArray=()

info=${content#*</ttl>}
result=$(echo "$info" | grep "<item>")
while [ "$result" != "" ]
do
  temp=${info%%</author>*}
  infoArray[$count]=$temp
  info=${info#*</item>}
  result=$(echo "$info" | grep "<link>")
  ((count++))
done

BVCount=0
bvDownloaded=()
for(( i=${#infoArray[@]} - 1;i >= 0;i--)) do
  item=${infoArray[i]}
  linkSuffix=${item#*<link>}
  link=${linkSuffix%%</link>*}
  bv=${link#*video/}
  oldBV=$(cat "${bv_location}")
  bvCompareRes=$(echo "$oldBV" | grep "$bv")
  if [ "$bvCompareRes" = "" ]; then
    titleSuffix=${item#*\[CDATA\[}
    tempVideoTitle=${titleSuffix%%\]\]>*}
    videoTitle=${tempVideoTitle//\//|}
    echo "video title: $videoTitle"
    #跳过已失效视频
    if [ "$videoTitle" = '已失效视频'  ]; then
        continue;
    fi
    #此处为视频存储位置，自行修改
    folderName="$videoLocation$videoTitle"
    mkdir "$folderName"
    #区分是否带 cookie 下载
    if [ "$cookies" != "" ]; then
        bilix s "$link" --subtitle --dm --image -nh --debug -d "$folderName" -vc 1 -sl 2MB -sr 2 -pc 2  --cookie "$sessdata_value"
    else
        bilix s "$link" --subtitle --dm --image -nh --debug -d "$folderName" -vc 1 -sl 2MB -sr 2 -pc 2
    fi
    #判断对应文件夹是否有视频文件来判断下载是否成功
    isDownloadedVideo=0
    for file in "$folderName"/*; do
      if [ "${file##*.}" = "mp4" ] || [ "${file##*.}" = "flv" ] || [ "${file##*.}" = "mkv" ]; then
        isDownloadedVideo=1
        break
      fi
    done
    downloadResult=""
    if [ $isDownloadedVideo = 1 ]; then
      echo "$bv" >>"${bv_location}"
      downloadResult="下载成功"
    else
      downloadResult="下载出现异常"
    fi
    if [ "$telegram_bot_token" != "" ]; then
      curl -s -X POST "https://api.telegram.org/bot$telegram_bot_token/sendMessage" -d chat_id="$telegram_chat_id" -d parse_mode=html -d text="<a href=\"${link}\">$videoTitle</a>%0A${downloadResult}"
    fi
    #记录此次任务中已下载的视频bv
    bvDownloaded[$BVCount]=$bv
    ((BVCount++))
  else
    continue
  fi
done

#收藏夹未更新
if [ ${#bvDownloaded[*]} = 0 ]; then
  jobResult='收藏夹本轮未检测到新视频'
else
  jobResult='收藏夹本轮检测完成'
fi
if [ "$telegram_bot_token" != "" ]; then
  curl -s -X POST "https://api.telegram.org/bot$telegram_bot_token/sendMessage" -d chat_id="$telegram_chat_id" -d parse_mode=html -d text="<a href=\"${favURL}\">$favTitle</a>%0A${jobResult}"
fi
