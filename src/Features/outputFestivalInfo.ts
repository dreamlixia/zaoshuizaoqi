/**
 * 调用命令（ZaoShuiZaoQi）后，在编辑器控制台 OUTPUT 打印中国老黄历节日等信息，每逢节假日toast送祝福。
 */
import * as vscode from 'vscode';
import { getLunarData, getJiejiariData } from '../Utils/api';
import { getGitUsername } from '../Utils/util';

const toastFestivalInfo = async () => {
    
    let username = '';
    try {
        username = await getGitUsername();
        // vscode.window.showInformationMessage(`当前 Git 用户名: ${username}`);
    } catch (error) {
        // vscode.window.showErrorMessage(`获取 Git 用户名失败: ${error}`);
    }

    // 例如使用当前日期，格式化为 yyyy-MM-dd
    const currentDate = new Date();
    const yyyy = currentDate.getFullYear();
    const mm = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const dd = ('0' + currentDate.getDate()).slice(-2);
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const apiKey = 'bbb14aaee65f2563d5a375adb1eb1b61';

    // 创建输出通道
    const output = vscode.window.createOutputChannel('Holiday Info');

    // 查询全年法定节假日日期-休假tips
    const theYear = new Date().getFullYear()?.toString();

    // 同时发起两个 API 请求，并等待它们都返回结果
    Promise.all([getLunarData(apiKey, dateStr), getJiejiariData(apiKey, dateStr)])
        .then(([lunarResult, jiejiariResult]) => {
            // vscode.window.showInformationMessage(JSON.stringify(lunarResult));
            // vscode.window.showInformationMessage(JSON.stringify(jiejiariResult?.list?.[0]));

            // 处理农历数据返回值（例如：农历节日、宜忌、神位等信息）
            if (lunarResult) {
                output.appendLine(`今天是${lunarResult?.gregoriandate ?? ''}${lunarResult?.festival ? `，${lunarResult?.festival}，祝你节日快乐！❤️` : ''}`);
                output.appendLine(`农历：${lunarResult.lubarmonth}${lunarResult.lunarday}${lunarResult.jieqi ?? ''}${lunarResult?.lunar_festival ? `·${lunarResult?.lunar_festival}` : ''}`);
                output.appendLine(`宜：${lunarResult.fitness}`);
                output.appendLine(`忌：${lunarResult.taboo}`);
                output.appendLine(`神位：${lunarResult.shenwei}`);

                if (lunarResult?.lunar_festival) {
                    vscode.window.showInformationMessage(`Hello ${username}，祝你${lunarResult?.lunar_festival}快乐！❤️`)
                }
                if (lunarResult?.festival) {
                    vscode.window.showInformationMessage(`Hello ${username}，祝你${lunarResult?.festival}快乐！❤️`)
                }
            }
            // 处理节假日数据返回值（例如：提示、休息、调休信息）
            if (jiejiariResult) {
                // 假设 jiejiariResult.list 是数组，取第一个数据项
                const jiejiariData = jiejiariResult?.list?.[0];
                if (jiejiariData) {
                    output.appendLine(`${jiejiariResult?.tip ?? ''}`);
                    output.appendLine(`${jiejiariResult?.rest ?? ''}`);
                }
            }
        })
        .then(async () => {
            // 全年法定节假日日期-休假tips
            await getJiejiariData(apiKey, theYear, { type:'1', mode:'1' })
                .then((res: any) => {
                    if (res?.list?.length > 0) {
                        res?.list?.forEach((item: any) => {
                            output.appendLine(`全年休假建议: `);
                            output.appendLine(`${item?.holiday ?? item?.vacation}(${item?.name})`);
                            output.appendLine(`- 休假技巧: ${item?.tip}[${item?.rest}]`);
                        });
                        output.show();
                    } else {
                        vscode.window.showInformationMessage('tips error');
                    }
                })
                .catch((err) => {
                    vscode.window.showErrorMessage(`获取全年休假建议失败：${err.message}`);
                });
        })
        .then(() => {
            // 最后统一显示输出通道
            output.show();
        })
        .catch((err) => {
            vscode.window.showErrorMessage(`请求数据错误：${err.message}`);
        });

    
};

export { toastFestivalInfo };