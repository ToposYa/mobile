for i in $(env|grep tm_|cut -d'=' -f1); do
  unset $i;
done

ENVIRONMENT=$1
INTERFACE=$(ip route sh|grep default|awk '{print $5}')
IP_ADDRESS=$(ip route sh|grep $INTERFACE|tail -1|sed -r "s/.*src (.*) metric.*/\\1/g")

if [[ -n $ENVIRONMENT ]] && [[ $ENVIRONMENT == 'production' ]]; then
  BACKEND_URL="https:\/\/www.toposya.com"
else
  BACKEND_URL="http:\/\/$IP_ADDRESS:3000"
fi

cat src/providers/app-config/app-config.ts.tpl|sed s/BACKEND_URL/$BACKEND_URL/g > src/providers/app-config/app-config.ts

ionic cordova run android \
  --livereload \
  --debug \
  --device \
  --consolelogs \
  --address $IP_ADDRESS
