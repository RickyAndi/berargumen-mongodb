#Berargumen

##Aplikasi real time argument map

|> Setup mode produksi

1) pindah branch ke production `git checkout production origin/production`
2) jalankan perintah `npm install`
3) jalankan perintah `bower install`, sebelumnya bower harus sudah terinstall secara global `npm install -g bower`
4) install gulp `npm install -g gulp`
5) jalankan perintah `gulp build-production`
6) jalankan mongodb server `mongod`
7) jalankan aplikasi, `node app.js`

