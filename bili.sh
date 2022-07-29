#!/bin/bash
you=/usr/local/bin/you-get
#telegram参数
telegram_bot_token=""
telegram_chat_id=""
#RSS 地址
rssURL="https://rsshub.app/bilibili/fav/31386575/86822275/0"
#脚本存放地址
scriptLocation="/root/"
#视频存放地址
videoLocation="/root/download/"
#邮件地址
mailAddress="178997821@qq.com"

#抓取rss更新
content=$(wget $rssURL -q -O -)
#获得时间戳
subpubdate=${content#*<pubDate>}
pubdate=${subpubdate%%</pubDate>*}
cur_sec=`date '+%s'`
#获得视频标题
content1=${content#*<item>}
subname=${content1#*\[CDATA\[}
name=${subname%%\]\]>*}
#如果时间戳记录文本不存在则创建（此处文件地址自行修改）
if [ ! -f "${scriptLocation}date.txt" ]; then
    echo 313340 >"$scriptLocation"date.txt
fi
#如果标题记录文本不存在则创建
if [ ! -f "${scriptLocation}title.txt" ]; then
    echo 313340 >"${scriptLocation}"title.txt
fi
#如果BV记录文本不存在则创建
if [ ! -f "${scriptLocation}BV.txt" ]; then
    echo 313340 >"${scriptLocation}"BV.txt
fi
#获得之前下载过的视频标题
oldtitle=$(cat "${scriptLocation}"title.txt)
#获得上一个视频的时间戳（文件地址自行修改）
olddate=$(cat "${scriptLocation}"date.txt)
#获得上一个视频的BV号
oldBV=$(cat "${scriptLocation}"BV.txt)
#此处为视频存储位置，自行修改
filename="$videoLocation$name"
#获得视频下载链接
sublink=${subpubdate#*<link>}
link=${sublink%%</link>*}
av=${link#*video/}
#aaaaa="GMT"
result=$(echo $pubdate | grep "GMT")
result5=$(echo $oldtitle | grep "$name")
result6=$(echo $oldBV | grep "$av")
#echo $result
#判断当前时间戳和上次记录是否相同，不同则代表收藏列表更新
if [ "$pubdate" != "$olddate" ] && [ "$result" != "" ] && [ "$result6" = "" ]; then
    #Cookies可用性检查
    stat=$($you -i -l -c "$scriptLocation"cookies.txt https://www.bilibili.com/video/BV1fK4y1t7hj)
    substat=${stat#*quality:}
    data=${substat%%#*}
    quality=${data%%size*}
    if [[ $quality =~ "4K" ]]; then
        #清空 Bilibili 文件夹
        rm -rf "$videoLocation"*
        #判断是否为重复标题
        if [ "$result5" != "" ]; then
            time=$(date "+%Y-%m-%d_%H:%M:%S")
            name="$name""("$time")"
        fi
        #获得封面图下载链接和文件名称
        subcontent=${content#*<img src=\"}
        photolink=${subcontent%%\"*}
        pname=${photolink#*archive/}
        #下载封面图（图片存储位置应和视频一致）
        wget -P "$videoLocation$name" $photolink
        #记录时间戳
        echo $pubdate >"${scriptLocation}"date.txt
        #记录标题
        echo $name >>"${scriptLocation}"title.txt
        #记录BV号
        echo $av >>"${scriptLocation}"BV.txt
        #获取视频清晰度以及大小信息
        stat=$($you -i -l -c "$scriptLocation"cookies.txt $link)
        #有几P视频
        count=$(echo $stat | awk -F'title' '{print NF-1}')
        #echo $count
        for ((i = 0; i < $count; i++)); do
            stat=${stat#*title:}
            title=${stat%%streams:*}
            substat=${stat#*quality:}
            data=${substat%%#*}
            quality=${data%%size*}
            size=${data#*size:}
            title=$(echo $title)
            quality=$(echo $quality)
            size=$(echo $size)
            #每一P的视频标题，清晰度，大小，发邮件用于检查下载是否正确进行
            #message=${message}"Title: "${title}$'\n'"Quality: "${quality}$'\n'"Size: "${size}$'\n\n' #邮件方式
            message=${message}"Title:%20"${title}"%0AQuality:%20"${quality}"%0ASize:%20"${size}"%0A%0A" #telegram方式
        done
        #发送开始下载邮件（自行修改邮件地址）
        #echo "$message" | mail -s "BFD：开始下载" $mailAddress
        curl -s -X POST "https://api.telegram.org/bot$telegram_bot_token/sendMessage" -d chat_id=$telegram_chat_id -d parse_mode=html -d text="<b>BFD：开始下载</b>%0A%0A$message"
        #下载视频到指定位置（视频存储位置自行修改；you-get下载B站经常会出错，所以添加了出错重试代码）
        count=1
        echo "1" > "${scriptLocation}${cur_sec}mark.txt"
        while true; do
            $you -l -c "$scriptLocation"cookies.txt -o "$videoLocation$name" $link > "${scriptLocation}${cur_sec}.txt" #如果是邮件通知，删除 > "${scriptLocation}${cur_sec}.txt"
            if [ $? -eq 0 ]; then
                #下载完成
                echo "0" > "${scriptLocation}${cur_sec}mark.txt"
                #重命名封面图
                result1=$(echo $pname | grep "jpg")
                if [ "$result1" != "" ]; then
                    mv "$videoLocation$name"/$pname "$videoLocation$name"/poster.jpg
                else
                    mv "$videoLocation$name"/$pname "$videoLocation$name"/poster.png
                fi
                #xml转ass && 获取下载完的视频文件信息
                for file in "$videoLocation$name"/*; do
                    if [ "${file##*.}" = "xml" ]; then
                        "${scriptLocation}"DanmakuFactory -o "${file%%.cmt.xml*}".ass -i "$file"
                        #删除源文件
                        #rm "$file"
                    elif [ "${file##*.}" = "mp4" ] || [ "${file##*.}" = "flv" ] || [ "${file##*.}" = "mkv" ]; then
                        videoname=${file#*"$name"\/}
                        videostat=$(du -h "$file")
                        videosize=${videostat%%\/*}
                        videosize=$(echo $videosize)
                        #videomessage=${videomessage}"Title: "${videoname}$'\n'"Size: "${videosize}$'\n\n'  #邮件方式
                        videomessage=${videomessage}"Title:%20"${videoname}"%0ASize:%20"${videosize}"%0A%0A" #telegram方式
                    fi
                done
                #发送下载完成邮件
                #echo "$videomessage" | mail -s "BFD：下载完成" $mailAddress
                curl -s -X POST "https://api.telegram.org/bot$telegram_bot_token/sendMessage" -d chat_id=$telegram_chat_id -d parse_mode=html -d text="<b>BFD：下载完成</b>%0A%0A$videomessage"
                #上传至OneDrive 百度云
                /usr/local/bin/BaiduPCS-Go upload "$videoLocation$name" /
                #发送通知
                #echo "$title" | mail -s "BFD：上传完成" $mailAddress #邮件方式
                curl -s -X POST "https://api.telegram.org/bot$telegram_bot_token/sendMessage" -d chat_id=$telegram_chat_id -d parse_mode=html -d text="<b>BFD：上传完成</b>%0A%0A$title"
                break
            else
                if [ "$count" != "1" ]; then
                    count=$(($count + 1))
                    sleep 2
                else
                    rm -rf "$videoLocation$name"
                    #发送通知
                    #echo "$name" | mail -s "BFD：下载失败" $mailAddress  #邮件
                    curl -s -X POST "https://api.telegram.org/bot$telegram_bot_token/sendMessage" -d chat_id=$telegram_chat_id -d parse_mode=html -d text="<b>BFD：下载失败</b>"
                    exit
                fi
            fi
        done & #如果是邮件通知，删除 & 和下面的内容(删到wait，fi保留)

        second="start"
        secondResult=$(curl -s -X POST "https://api.telegram.org/bot$telegram_bot_token/sendMessage" -d chat_id=$telegram_chat_id -d parse_mode=html -d text="$second")
        subSecondResult="${secondResult#*message_id\":}"
        messageID=${subSecondResult%%,\"from*}

        ccount=0
        while true; do
            sleep 2
            text=$(tail -1 "${scriptLocation}${cur_sec}.txt")
            echo $text > "${scriptLocation}${cur_sec}${cur_sec}.txt"
            sed -i -e 's/\r/\n/g' "${scriptLocation}${cur_sec}${cur_sec}.txt"
            text=$(sed -n '$p' "${scriptLocation}${cur_sec}${cur_sec}.txt")
            result=$(curl -s -X POST "https://api.telegram.org/bot$telegram_bot_token/editMessageText" -d chat_id=$telegram_chat_id -d message_id=$messageID -d text="$text")
            mark=$(cat "${scriptLocation}${cur_sec}mark.txt")
            if [ $mark -eq 0 ]; then
                break
            fi
        done
        wait
        rm "${scriptLocation}${cur_sec}.txt"
        rm "${scriptLocation}${cur_sec}${cur_sec}.txt"
        rm "${scriptLocation}${cur_sec}mark.txt"
    else
        curl -s -X POST "https://api.telegram.org/bot$telegram_bot_token/sendMessage" -d chat_id=$telegram_chat_id -d parse_mode=html -d text="<b>BFD：Cookies 文件失效，请更新后重试</b>%0A%0A$videomessage"
    fi
fi
