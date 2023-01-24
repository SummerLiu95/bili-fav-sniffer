#!/bin/bash
you=you-get

#配置参数
dirLocation="./"
#telegram参数
telegram_bot_token="5144461932:AAEaZ88e2-9cmbyU5EsyxgnZCA5AiFgcNbY"
telegram_chat_id="1779452711"
#视频存放地址
videoLocation="/Users/summer/Movies/you-get-download/"
uid=31386575
fid=1719937875
favURL="https://space.bilibili.com/$uid/favlist?fid=$fid"
#RSS 地址
rssURL="https://rsshub.app/bilibili/fav/$uid/$fid/1"

#抓取rss更新
content=$(wget $rssURL -q -O -)

#获取收藏夹名称和链接
favTitleSuffix=${content%%<atom:link*}
temp=${favTitleSuffix#*\[CDATA\[}
favTitle=${temp%%\]\]>*}
echo "favTitle: $favTitle"

#获得最新视频发布时间戳
tempPubDate=${content#*<pubDate>}

#获得最新视频标题
itemSuffix=${content#*<item>}
titleSuffix=${itemSuffix#*\[CDATA\[}
videoTitle=${titleSuffix%%\]\]>*}
echo "videoTitle: $videoTitle"

#如果BV记录文本不存在则创建
if [ ! -f "${dirLocation}BV.txt" ]; then
    echo "" >"${dirLocation}"BV.txt
fi

#获得上一个视频的BV号
oldBV=$(cat "${dirLocation}"BV.txt)
#此处为视频存储位置，自行修改
folderName="$videoLocation$videoTitle"

#获得视频下载链接
subLink=${tempPubDate#*<link>}
link=${subLink%%</link>*}
bv=${link#*video/}

echo "link: $link"
echo "BV: $bv"

bvCompareRes=$(echo "$oldBV" | grep "$bv")
echo "bvCompareRes: $bvCompareRes"


#判断当前时间戳和上次记录是否相同，不同则代表收藏列表更新
if [ "$bvCompareRes" = "" ]; then
    #Cookies可用性检查
    stat=$($you -i -l -c "$dirLocation"cookies.txt https://www.bilibili.com/video/BV1fK4y1t7hj)
    subStat=${stat#*quality:}
    data=${subStat%%#*}
    quality=${data%%size*}
    if [[ $quality =~ "4K" ]]; then
        #获得封面图下载链接和文件名称
        subContent=${content#*<img src=\"}
        photoLink=${subContent%%\"*}
        pName=${photoLink#*archive/}
        echo "photoLink: $photoLink"
        echo "pName: $pName"
        #下载封面图（图片存储位置应和视频一致）
        pNameCompareRes=$(echo "$pName" | grep "jpg")
        echo "pNameCompareRes: $pNameCompareRes"
        mkdir "$folderName"
        if [ "$pNameCompareRes" != "" ]; then
          wget "$photoLink" -O "$folderName/$videoTitle.jpg"
        else
          wget "$photoLink" -O "$folderName/$videoTitle.png"
        fi
        curl -s -X POST "https://api.telegram.org/bot$telegram_bot_token/sendMessage" -d chat_id=$telegram_chat_id -d parse_mode=html -d text="<a href=\"${link}\">$videoTitle</a>%0A开始下载"
        $you --playlist -c "$dirLocation"cookies.txt -o "$folderName" "$link"
        echo "$bv" >>"${dirLocation}"BV.txt
        curl -s -X POST "https://api.telegram.org/bot$telegram_bot_token/sendMessage" -d chat_id=$telegram_chat_id -d parse_mode=html -d text="<a href=\"${link}\">$videoTitle</a>%0A下载成功"
    else
        curl -s -X POST "https://api.telegram.org/bot$telegram_bot_token/sendMessage" -d chat_id=$telegram_chat_id -d parse_mode=html -d text="Cookies 文件失效，请更新后重试"
    fi
else
    curl -s -X POST "https://api.telegram.org/bot$telegram_bot_token/sendMessage" -d chat_id=$telegram_chat_id -d parse_mode=html -d text="<a href=\"${favURL}\">$favTitle</a>%0A收藏夹未更新"
fi
