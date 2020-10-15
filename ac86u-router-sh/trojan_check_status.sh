#!/bin/sh

process_exists=$(ps | grep trojan | grep -v check | grep -v grep | wc -l)
 if [ $process_exists -eq 0 ]; then
  source /koolshare/bin/trojan-restart.sh
  echo "Check status fail, restart trojan completed." >> /koolshare/ss/trojan_running.log
fi
