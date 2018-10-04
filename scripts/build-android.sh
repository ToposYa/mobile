#!/bin/bash -e 
for i in $(env|grep tm_|cut -d'=' -f1); do
  unset $i;
done

BACKEND_URL="https:\/\/www.toposya.com"
RELEASE_DIR="platforms/android/app/build/outputs/apk/release/"
UNSIGNED="platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk"
SIGNED="platforms/android/app/build/outputs/apk/release/app-release-signed.apk"
ZIPALIGNED="platforms/android/app/build/outputs/apk/release/app-release-zipaligned.apk"
FINAL="platforms/android/app/build/outputs/apk/release/app-release.apk"

ZIPALIGN="$HOME/Android/Sdk/build-tools/28.0.3/zipalign"

cat src/providers/app-config/app-config.ts.tpl|sed s/BACKEND_URL/$BACKEND_URL/g > src/providers/app-config/app-config.ts

rm $RELEASE_DIR/*
ionic cordova build android --prod --release
cp $UNSIGNED $SIGNED
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore keys/my-release-key.keystore $SIGNED alias_name
$ZIPALIGN -v 4 $SIGNED $ZIPALIGNED
cp $ZIPALIGNED $FINAL

echo $FINAL
