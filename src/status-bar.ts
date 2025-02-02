import { StatusBarAlignment, ThemeColor, workspace, commands, window  } from 'vscode';
import { getAnnotations, createAnnotationFiles, missingAnnotationFiles } from './annotation';


const commandId = 'package-annotator.showSelectionCount';

export async function createStatusBarItem(subscriptions: { dispose(): any }[]) {

	subscriptions.push(commands.registerCommand(commandId, async () => {
		const result = await window.showQuickPick(
			['Create a package.annotations.json file', 'Ignore warning'],
			{ placeHolder: 'A package.annotations.json file is needed to annotate scripts' }
		);
		console.log(result);
		if (result === 'Create a package.annotations.json file')
			createAnnotationFiles();
		else {
			// TODO: add ignore warning to settings
		}
	}));

	const statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 1000);
	statusBarItem.text = `Missing annotations file!`;
	statusBarItem.command = commandId;
	statusBarItem.backgroundColor = new ThemeColor('statusBarItem.warningBackground');
	subscriptions.push(statusBarItem);

	const watcher = workspace.createFileSystemWatcher('**/package*.json');
	watcher.onDidCreate(updateStatusBarItem);
	watcher.onDidDelete(updateStatusBarItem);
	watcher.onDidChange(updateStatusBarItem);

	await updateStatusBarItem();


	async function updateStatusBarItem() {
		await getAnnotations();
		if (missingAnnotationFiles())
			statusBarItem.show();
		else
			statusBarItem.hide();
	}
}
