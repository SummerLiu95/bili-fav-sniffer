#!/bin/bash
you=you-get

#配置参数
dirLocation="./"
telegram_bot_token=$(jq -c -r .telegram_bot_token ./config.json)
telegram_chat_id=$(jq -c -r .telegram_chat_id ./config.json)
uid=$(jq -c -r .uid ./config.json)
fid=$(jq -c -r .fid ./config.json)
videoLocation=$(jq -c -r .video_location ./config.json)
cookies_location=$(jq -c -r .cookies_location ./config.json)
bv_location=$(jq -c -r .bv_location ./config.json)

favURL="https://space.bilibili.com/$uid/favlist?fid=$fid"
rssURL="https://rsshub.app/bilibili/fav/$uid/$fid/1"

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
for(( i=0;i<${#infoArray[@]};i++)) do
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
    echo "$bv" >>"${bv_location}"
    curl -s -X POST "https://api.telegram.org/bot$telegram_bot_token/sendMessage" -d chat_id="$telegram_chat_id" -d parse_mode=html -d text="<a href=\"${link}\">$videoTitle</a>%0A下载成功"
    #记录此次任务中已下载的视频bv
    bvDownloaded[$BVCount]=$bv
    ((BVCount++))
  else
    break
  fi
done

#收藏夹未更新
if [ ${#bvDownloaded[*]} = 0 ]; then
  curl -s -X POST "https://api.telegram.org/bot$telegram_bot_token/sendMessage" -d chat_id="$telegram_chat_id" -d parse_mode=html -d text="<a href=\"${favURL}\">$favTitle</a>%0A收藏夹本轮未检测到新视频"
else
  curl -s -X POST "https://api.telegram.org/bot$telegram_bot_token/sendMessage" -d chat_id="$telegram_chat_id" -d parse_mode=html -d text="<a href=\"${favURL}\">$favTitle</a>%0A收藏夹本轮检测完成"
fi
