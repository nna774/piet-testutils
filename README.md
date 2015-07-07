# piet-testutils
人類がPietのテストを手でやるのは不毛である（人類がPietをするのが不毛かどうかはここでは触れない）。
Piet のテストツールです。

# install
nodejsとimagemagickに依存しています。

````
git clone git@github.com:nna774/piet-testutils.git
npm install
````

# 使い方
config.js を開いて、codelを変更してください。

その下のverbose変数は、falseの時はテスト失敗時にだけ報告し、trueの時は成功時にも報告します。

次にtests.jsを開いてください。空気を読んで設定してください。
inputは、配列で指定してください。

設定が完了したら`node app.js (テストしたい画像のファイル名)`で動かしてください。

# License
LGPL3.0 or any later versionです。

## devide_by_2.10cs.11x4.png
Created by Hideaki Nagamine(https://github.com/1995hnagamin)
Creative Commons BY-SA 4.0
