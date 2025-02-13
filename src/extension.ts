import * as vscode from 'vscode';
import { toastFestivalInfo } from './Features/outputFestivalInfo';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "zaoshuizaoqi" is now active!');

	// 自动执行暂时去掉，因API调用次数有限。
	// toastFestivalInfo();

	const disposable = vscode.commands.registerCommand('zaoshuizaoqi.zaoshuizaoqi', () => {

		// vscode.window.showInformationMessage('Hello Sunchanghong，元宵节快乐!');

		// Toast 农历节日
		toastFestivalInfo();

	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
