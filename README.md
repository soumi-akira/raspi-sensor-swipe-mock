# raspi-sensor-swipe-mock

Raspberry PI + 測距センサー x 2 で簡易的なジェスチャ認識をするデモ

## 事前準備

### 動画を用意

サンプル動画が `ignore` されているので、追加する。

> Raspberry PI 4 のハードウェアアクセラレーションは `1080` / `30fps` が限度なので注意。

https://mazwai.com/video/icelandic-glacier-lake/455191

`assets/movie.mp4` として保存する。

### 配線

https://jp.sharp/products/device/lineup/selection/opto/haca/diagram.html

16 番ピンと 18 番ピンに測距センサーの信号を送るように配線する。

デモでは、16 番が右側、18 番が左側に配置される想定になっている。

### ビルド

ビルドコマンドでフロントエンドとサーバーが両方書き出される。

```sh
yarn build
```

### 実行

書き出された `js` ファイルを実行する。

```sh
node dist/app.js
```

永続化したい場合は、`pm2` 等の利用を検討。

```sh
sudo npm i -g pm2
sudo pm2 install pm2-logrotate

pm2 startup
# 出力される指示に従う

pm2 start dist/app.js
pm2 save
```
