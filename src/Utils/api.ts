var request = require('request');

/**
 * 封装调用天天行数据 API 获取农历数据的请求
 */
/**
 * 中国老黄历
 * Response Body:
    {
    "code": 200,
    "msg": "success",
    "result": {
        "gregoriandate": "2025-01-01",
        "lunardate": "2024-12-2",
        "lunar_festival": "",
        "festival": "元旦",
        "fitness": "日值月破 大事不宜",
        "taboo": "日值月破 大事不宜",
        "shenwei": "喜神：西北 福神：西南 财神：正东 阳贵：东北 阴贵：西南 ",
        "taishen": "碓磨莫移动,碓须忌,床栖胎神在外正南停留5天",
        "chongsha": "马日冲(甲子)鼠",
        "suisha": "岁煞北",
        "wuxingjiazi": "火",
        "wuxingnayear": "佛灯火",
        "wuxingnamonth": "洞下水",
        "xingsu": "西方参水猿-凶",
        "pengzu": "庚不经络 午不苫盖",
        "jianshen": "破",
        "tiangandizhiyear": "甲辰",
        "tiangandizhimonth": "丙子",
        "tiangandizhiday": "庚午",
        "lmonthname": "季冬",
        "shengxiao": "龙",
        "lubarmonth": "腊月",
        "lunarday": "初二",
        "jieqi": ""
    }
    }
*/
export function getLunarData(apiKey: string, dateStr: string): Promise<any> {
    return new Promise((resolve, reject) => {
        request.post({
            url: 'https://apis.tianapi.com/lunar/index',
            form: {
                key: apiKey,
                date: dateStr
            }
        }, (err: any, _response: any, body: any) => {
            if (err) {
                return reject(err);
            }
            try {
                const json = JSON.parse(body);
                if (json.code === 200 && json.result) {
                    resolve(json.result);
                } else {
                    reject(new Error(`农历数据接口错误：${json.msg || '未知错误'}`));
                }
            } catch (error) {
                reject(error);
            }
        });
    });
}

/**
 * 封装调用天天行数据 API 获取节假日数据的请求
 */
/**
 * 节假日
 * Response Body:
    {
    "code": 200,
    "msg": "success",
    "result": {
        "list": [
            {
                "date": "2021-01-01",
                "daycode": 1,
                "weekday": 5,
                "cnweekday": "星期五",
                "lunaryear": "庚子",
                "lunarmonth": "冬月",
                "lunarday": "十八",
                "info": "节假日",
                "start": 0,
                "now": 0,
                "end": 2,
                "holiday": "1月1号",
                "name": "元旦节",
                "enname": "New Year's Day",
                "isnotwork": 1,
                "vacation": [
                "2021-01-01",
                "2021-01-02",
                "2021-01-03"
                ],
                "remark": "",
                "wage": 3,
                "tip": "1月1日放假，共3天。",
                "rest": "2020年12月28日至12月31日请假4天，与周末连休可拼七天长假。"
            }
        ]
    }
    }
*/
export function getJiejiariData(apiKey: string, dateStr: string): Promise<any> {
    return new Promise((resolve, reject) => {
        request.post({
            url: 'https://apis.tianapi.com/jiejiari/index',
            form: {
                key: apiKey,
                date: dateStr,
                type: 0
            }
        }, (err: any, _response: any, body: any) => {
            if (err) {
                return reject(err);
            }
            try {
                const json = JSON.parse(body);
                if (json.code === 200 && json.result) {
                    resolve(json.result);
                } else {
                    reject(new Error(`节假日数据接口错误：${json.msg || '未知错误'}`));
                }
            } catch (error) {
                reject(error);
            }
        });
    });
}