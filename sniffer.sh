#!/bin/bash
you=you-get

#配置参数
dirLocation="./"
#视频存放地址
videoLocation="/Users/summer/Movies/you-get-download/"

#RSS 地址
rssURL="https://rsshub.app/bilibili/fav/31386575/1719937875/1"


#抓取rss更新
content=$(wget $rssURL -q -O -)

#获得最新视频发布时间戳
tempPubDate=${content#*<pubDate>}
pubDate=${tempPubDate%%</pubDate>*}
cur_sec=$(date '+%s')
echo "$pubDate"
#echo "$cur_sec"

#获得最新视频标题
itemSuffix=${content#*<item>}
titleSuffix=${itemSuffix#*\[CDATA\[}
videoTitle=${titleSuffix%%\]\]>*}
#echo "$videoTitle"

#如果时间戳记录文本不存在则创建（此处文件地址自行修改）
if [ ! -f "${dirLocation}date.txt" ]; then
    echo 313340 >"${dirLocation}"date.txt
fi

#如果标题记录文本不存在则创建
if [ ! -f "${dirLocation}title.txt" ]; then
    echo 313340 >"${dirLocation}"title.txt
fi

#如果BV记录文本不存在则创建
if [ ! -f "${dirLocation}BV.txt" ]; then
    echo 313340 >"${dirLocation}"BV.txt
fi

#获得之前下载过的视频标题
oldTitle=$(cat "${dirLocation}"title.txt)
#获得上一个视频的时间戳（文件地址自行修改）
oldDate=$(cat "${dirLocation}"date.txt)
#获得上一个视频的BV号
oldBV=$(cat "${dirLocation}"BV.txt)
#此处为视频存储位置，自行修改
filename="$videoLocation$videoTitle"

#获得视频下载链接
subLink=${tempPubDate#*<link>}
link=${subLink%%</link>*}
av=${link#*video/}

#echo "$link"
#echo "$av"

result=$(echo "$pubDate" | grep "GMT")
titleCompareRes=$(echo "$oldTitle" | grep "$videoTitle")
bvCompareRes=$(echo "$oldBV" | grep "$av")
echo "$result"
echo "$titleCompareRes"
echo "$bvCompareRes"


#判断当前时间戳和上次记录是否相同，不同则代表收藏列表更新
if [ "$pubDate" != "$oldDate" ] && [ "$result" != "" ] && [ "$bvCompareRes" = "" ]; then
    #Cookies可用性检查
    stat=$($you -i -l -c "$dirLocation"cookies.txt https://www.bilibili.com/video/BV1fK4y1t7hj)
    subStat=${stat#*quality:}
    data=${subStat%%#*}
    quality=${data%%size*}
    if [[ $quality =~ "4K" ]]; then
        echo "Cookies 文件有效，进入下载逻辑"
        #判断是否为重复标题
        if [ "$titleCompareRes" != "" ]; then
            time=$(date "+%Y-%m-%d_%H:%M:%S")
            name="$videoTitle""("$time")"
        fi
        #获得封面图下载链接和文件名称
        subContent=${content#*<img src=\"}
        photoLink=${subContent%%\"*}
        pName=${photoLink#*archive/}
        echo "$photoLink"
        #下载封面图（图片存储位置应和视频一致）
        wget -P "$videoLocation$videoTitle" "$photoLink"
        #记录时间戳
        echo "$pubDate" >"${dirLocation}"date.txt
        #记录标题
        echo "$videoTitle" >>"${dirLocation}"title.txt
        #记录BV号
        echo "$av" >>"${dirLocation}"BV.txt
        #获取视频清晰度以及大小信息
        stat=$($you -i -l -c -d "${dirLocation}"cookies.txt "$link")
        #有几P视频
        count=$(echo "$stat" | awk -F'title' '{print NF-1}')
        echo "$count"
        #下载视频到指定位置（视频存储位置自行修改；you-get下载B站经常会出错，所以添加了出错重试代码）
        count=1
        echo "1" > "${dirLocation}${cur_sec}mark.txt"
        while true; do
            $you -l -c "$dirLocation"cookies.txt -o "$videoLocation$name" "$link"
            if [ $? -eq 0 ]; then
                #下载完成
                echo "0" > "${dirLocation}${cur_sec}mark.txt"
                #重命名封面图
                result1=$(echo "$pName" | grep "jpg")
                if [ "$result1" != "" ]; then
                    mv "$videoLocation$name"/"$pName" "$videoLocation$name"/poster.jpg
                else
                    mv "$videoLocation$name"/"$pName" "$videoLocation$name"/poster.png
                fi
            else
                if [ "$count" != "1" ]; then
                    count=$(($count + 1))
                    sleep 2
                else
                    rm -rf "$videoLocation$name"
                    #发送通知
                    exit
                fi
            fi
        done
        rm "${dirLocation}${cur_sec}.txt"
        rm "${dirLocation}${cur_sec}${cur_sec}.txt"
        rm "${dirLocation}${cur_sec}mark.txt"
    else
        echo "Cookies 文件失效，请更新后重试"
    fi
fi

#$you -i 'https://youtu.be/xx4gh8TBMZQ'
