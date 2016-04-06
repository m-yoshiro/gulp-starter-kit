# gulp starter kit
gulpでプロジェクトを始めるための基本構成を取りまとめたキットです。

### Installation
```
# 0. hologram, slimをインストールしてない場合
gem install slim
gem install hologram

# 1. download
git clone https://github.com/m-yoshiro/gulp-starter-kit

# 2. ダウンロード先に移動
cd gulp-starter-kit

# 3. インストールを実行
npm install
```

### command
```

# コンパイルの実行
# 初回実行でdistフォルダが作成される
gulp

# ローカルサーバの起動と監視
gulp serve
# localhost:3000 application
# localhost:3002 styleguide

```

### feature
- sass
- slim
- styleguide
    - hologram
    https://github.com/trulia/hologram
    - wearecube/hologram-github-theme
    https://github.com/wearecube/hologram-github-theme

## Inspiration
以下のrepositoryを参考にさせていただきました。
[google/web-starter-kit](https://github.com/google/web-starter-kit)
[vwxyutarooo/gulp-web-starter](https://github.com/vwxyutarooo/gulp-weba   -starter)
