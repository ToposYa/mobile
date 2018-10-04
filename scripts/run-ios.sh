for i in $(env|grep tm_|cut -d'=' -f1); do
  unset $i;
done

BACKEND_URL="https:\/\/www.toposya.com"
cat src/providers/app-config/app-config.ts.tpl|sed s/BACKEND_URL/$BACKEND_URL/g > src/providers/app-config/app-config.ts

ionic cordova build ios
ionic cordova emulate ios -c
