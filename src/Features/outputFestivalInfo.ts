/**
 * 调用命令（ZaoShuiZaoQi）后，在编辑器控制台 OUTPUT 打印中国老黄历节日等信息，每逢节假日toast送祝福。
 */
import * as vscode from 'vscode';
import { getLunarData, getJiejiariData } from '../Utils/api';
import { getGitUsername } from '../Utils/util';

// 辅助函数
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (fetchFn: () => Promise<any>, retries = 3, delayMs = 1000) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await fetchFn();
        } catch (error) {
            if (i === retries - 1) throw error;
            await delay(delayMs * (i + 1)); // 递增延迟
        }
    }
};

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
                    vscode.window.showInformationMessage(`Hello ${username}，祝你${lunarResult?.lunar_festival}快乐！❤️`);
                }
                if (lunarResult?.festival) {
                    vscode.window.showInformationMessage(`Hello ${username}，祝你${lunarResult?.festival}快乐！❤️`);
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
            // 查询全年法定节假日日期-休假tips
            const currentMonth = currentDate.getMonth() + 1; // 获取当前月份(0-11，所以需要+1)
            
            try {
                // 当前年份的休假建议
                const res = await fetchWithRetry(() => 
                    getJiejiariData(apiKey, yyyy.toString(), { type:'1', mode:'1' })
                );
                
                if (res?.list?.length > 0) {
                    output.appendLine(`📅 【${yyyy}年休假建议】: `);
                    res?.list?.forEach((item: any) => {
                        output.appendLine(`${item?.holiday ?? item?.vacation}(${item?.name})`);
                        output.appendLine(`- ⛱️ ：${item?.tip}[${item?.rest}]`);
                    });
                } else {
                    vscode.window.showInformationMessage('tips error');
                }
                
                // 如果当前月份大于等于10月，还需要显示下一年的休假建议
                if (currentMonth >= 10) {
                    // 添加延迟避免频率限制
                    await delay(500);
                    
                    const nextYear = (yyyy + 1).toString();
                    const nextRes = await fetchWithRetry(() => 
                        getJiejiariData(apiKey, nextYear, { type:'1', mode:'1' })
                    );
                    
                    if (nextRes?.list?.length > 0) {
                        output.appendLine(`📅 【${nextYear}年休假建议】: `);
                        nextRes?.list?.forEach((item: any) => {
                            output.appendLine(`${item?.holiday ?? item?.vacation}(${item?.name})`);
                            output.appendLine(`- ⛱️ ：${item?.tip}[${item?.rest}]`);
                        });
                    } else {
                        vscode.window.showInformationMessage('next year tips error');
                    }
                }
            } catch (err) {
                vscode.window.showErrorMessage(`获取休假建议失败`);
            }
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