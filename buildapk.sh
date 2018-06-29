#!/bin/bash
cordova build --release android
cp /home/ldinnout/devel/ionic/knowledge/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk .
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore app-release-unsigned.apk alias_name
rm knowledge.apk 
zipalign -v 4 app-release-unsigned.apk knowledge.apk
adb install knowledge.apk
