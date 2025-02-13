配置
<!-- ![](vsce package --baseContentUrl "git@github.com:dreamlixia/zaoshuizaoqi.git/blob/master" --baseImagesUrl "git@github.com:dreamlixia/zaoshuizaoqi.git/raw/master") -->

天行数据API
https://www.tianapi.com/console/
账号：Lynsey
APIKEY：bbb14aaee65f2563d5a375adb1eb1b61

package.json激活事件配置
```json
{
    // 1. 执行命令方式
    "activationEvents": [
        "onCommand:extension.zaoshuizaoqi",
        "onStartupFinished"
    ],
    // 2. 自动执行
    "activationEvents": ["*"]
}
```