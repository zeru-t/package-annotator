import { StatusBarAlignment, ThemeColor, workspace, commands, window } from 'vscode';
import { getAnnotations, createAnnotationFiles, missingAnnotationFiles } from './annotation';
import { hideWarning, hideButton } from './configuration';


const commandId = 'package-annotator.generateAnnotationFiles';

export async function createStatusBarItem(subscriptions: { dispose(): any }[]) {

	subscriptions.push(commands.registerCommand(commandId, async () => {
		await createAnnotationFiles();
		await updateStatusBarItem();
	}));

	const warningStatusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 1001);
	warningStatusBarItem.text = `$(warning) $(package)`;
	warningStatusBarItem.tooltip = `Missing Annotation files!`;
	warningStatusBarItem.backgroundColor = new ThemeColor('statusBarItem.warningBackground');
	subscriptions.push(warningStatusBarItem);

	const buttonStatusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 1000);
	buttonStatusBarItem.text = `Generate Annotation files`;
	buttonStatusBarItem.command = commandId;
	subscriptions.push(buttonStatusBarItem);

	const watcher = workspace.createFileSystemWatcher('**/package*.json');
	watcher.onDidCreate(updateStatusBarItem);
	watcher.onDidDelete(updateStatusBarItem);
	watcher.onDidChange(updateStatusBarItem);
	workspace.onDidChangeConfiguration(updateStatusBarItem);

	await updateStatusBarItem();


	async function updateStatusBarItem() {
		await getAnnotations();
		if (missingAnnotationFiles()) {
			if (hideWarning()) warningStatusBarItem.hide();
			else warningStatusBarItem.show();
			if (hideButton()) buttonStatusBarItem.hide();
			else buttonStatusBarItem.show();
		}
		else {
			warningStatusBarItem.hide();
			buttonStatusBarItem.hide();
		}
	}
}
