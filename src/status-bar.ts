import { StatusBarAlignment, ThemeColor, workspace, commands, window  } from 'vscode';
import { getAnnotations, createAnnotationFiles, missingAnnotationFiles } from './annotation';
import { hideWarning, extensionDisabled } from './configuration';


const commandId = 'package-annotator.showSelectionCount';

export async function createStatusBarItem(subscriptions: { dispose(): any }[]) {

	if (extensionDisabled())
		return;

	subscriptions.push(commands.registerCommand(commandId, async () => {
		await createAnnotationFiles();
		await updateStatusBarItem();
	}));

	const generatorStatusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 1000);
	generatorStatusBarItem.text = `Generate Annotation files`;
	generatorStatusBarItem.command = commandId;
	generatorStatusBarItem.show();
	subscriptions.push(generatorStatusBarItem);

	const warningStatusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 1001);
	warningStatusBarItem.text = `$(warning) $(package)`;
	warningStatusBarItem.tooltip = `Missing Annotation files!`;
	generatorStatusBarItem.command = commandId;
	warningStatusBarItem.backgroundColor = new ThemeColor('statusBarItem.warningBackground');
	subscriptions.push(warningStatusBarItem);

	const watcher = workspace.createFileSystemWatcher('**/package*.json');
	watcher.onDidCreate(updateStatusBarItem);
	watcher.onDidDelete(updateStatusBarItem);
	watcher.onDidChange(updateStatusBarItem);
	workspace.onDidChangeConfiguration(updateStatusBarItem);

	await updateStatusBarItem();


	async function updateStatusBarItem() {
		await getAnnotations();
		if (missingAnnotationFiles() && !hideWarning() && !extensionDisabled())
			warningStatusBarItem.show();
		else
			warningStatusBarItem.hide();
	}
}
