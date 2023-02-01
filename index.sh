#!/bin/bash
source /etc/profile #添加这句
export PATH=/opt/homebrew/bin/:$PATH

you=you-get
dirLocation=$(cd `dirname $0`; pwd)
#配置参数
telegram_bot_token=$(jq -c -r .telegram_bot_token "$dirLocation"/config/config.json)
telegram_chat_id=$(jq -c -r .telegram_chat_id "$dirLocation"/config/config.json)
uid=$(jq -c -r .uid "$dirLocation"/config/config.json)
fid=$(jq -c -r .fid "$dirLocation"/config/config.json)
rssDomain=$(jq -c -r .rssDomain "$dirLocation"/config/config.json)
videoLocation="/usr/you-get-download/"
cookies_location="$dirLocation"/config/cookies.txt
bv_location="$dirLocation"/config/BV.txt

favURL="https://space.bilibili.com/$uid/favlist?fid=$fid"
rssURL="$rssDomain/bilibili/fav/$uid/$fid/1"

#rss 可访问性检测
response=$(curl -I -m 10 -o /dev/null -s -w %{http_code} "$rssURL")
if [ "$response" != 200 ]; then
  curl -s -X POST "https://api.telegram.org/bot$telegram_bot_token/sendMessage" -d chat_id="$telegram_chat_id" -d parse_mode=html -d text="$rssURL: RSS 访问失效"
  exit
else
  curl -s -X POST "https://api.telegram.org/bot$telegram_bot_token/sendMessage" -d chat_id="$telegram_chat_id" -d parse_mode=html -d text="$rssURL: RSS 访问有效"
fi

#抓取rss更新
content=$(wget "$rssURL" -q -O -)

#获取收藏夹名称和链接
favTitleSuffix=${content%%<atom:link*}
temp=${favTitleSuffix#*\[CDATA\[}
favTitle=${temp%%\]\]>*}
echo "favTitle: $favTitle"

#Cookies可用性检查
stat=$($you -i -l -c "$cookies_location" https://www.bilibili.com/video/BV1fK4y1t7hj)
subStat=${stat#*quality:}
data=${subStat%%#*}
quality=${data%%size*}
if [[ $quality =~ "4K" ]]; then
    curl -s -X POST "https://api.telegram.org/bot$telegram_bot_token/sendMessage" -d chat_id=$telegram_chat_id -d parse_mode=html -d text="$favTitle: Cookies 文件有效，进入检测更新逻辑"
else
    curl -s -X POST "https://api.telegram.org/bot$telegram_bot_token/sendMessage" -d chat_id=$telegram_chat_id -d parse_mode=html -d text="$favTitle: Cookies 文件失效，请更新后重试"
    exit
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
    videoTitle=${titleSuffix%%\]\]>*}
    echo "videoTitle: $videoTitle"
    #此处为视频存储位置，自行修改
    folderName="$videoLocation$videoTitle"
    #获得封面图下载链接和文件名称
    subContent=${item#*<img src=\"}
    photoLink=${subContent%%\"*}
    pName=${photoLink#*archive/}
    echo "photoLink: $photoLink"
    echo "pName: $pName"
    #下载封面图（图片存储位置应和视频一致）
    pNameCompareRes=$(echo "$pName" | grep "jpg")
    mkdir "$folderName"
    if [ "$pNameCompareRes" != "" ]; then
      wget "$photoLink" -O "$folderName/$videoTitle.jpg"
    else
      wget "$photoLink" -O "$folderName/$videoTitle.png"
    fi
    curl -s -X POST "https://api.telegram.org/bot$telegram_bot_token/sendMessage" -d chat_id="$telegram_chat_id" -d parse_mode=html -d text="<a href=\"${link}\">$videoTitle</a>%0A开始下载"
    $you --playlist -c "$cookies_location" -o "$folderName" "$link"
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
    curl -s -X POST "https://api.telegram.org/bot$telegram_bot_token/sendMessage" -d chat_id="$telegram_chat_id" -d parse_mode=html -d text="<a href=\"${link}\">$videoTitle</a>%0A${downloadResult}"
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
curl -s -X POST "https://api.telegram.org/bot$telegram_bot_token/sendMessage" -d chat_id="$telegram_chat_id" -d parse_mode=html -d text="<a href=\"${favURL}\">$favTitle</a>%0A${jobResult}"
