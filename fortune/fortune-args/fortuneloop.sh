#!/bin/bash
trap "exit" SIGINT
INTERVAL="$1"
echo "Configured to generate fortune every $INTERVAL seconds"

mkdir /var/htdocs

while :
do
    echo $(date) Writing to fortune to /var/htdocs/index.html
    /usr/games/fortune > /var/htdocs/index.html
    sleep $INTERVAL
done
