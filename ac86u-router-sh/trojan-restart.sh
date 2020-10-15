#!/bin/sh
echo -n "" > /koolshare/ss/trojan_running.log
echo -n $(date) >> /koolshare/ss/trojan_running.log
echo -n " Start running trojan..." >> /koolshare/ss/trojan_running.log
sleep 15
killall rss-redir >/dev/null 2>&1
killall trojan >/dev/null 2>&1
sleep 5
nohup /koolshare/bin/trojan -c /koolshare/ss/trojan_nat.json >/dev/null 2>&1 &
echo " end scripts." >> /koolshare/ss/trojan_running.log
