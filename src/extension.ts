import { ExtensionContext, Disposable, languages } from 'vscode';
import { AnnotationProvider } from './annotation';
import { createStatusBarItem } from './status-bar';


let disposables: Disposable[] = [];

export async function activate(_context: ExtensionContext) {
	await createStatusBarItem(_context.subscriptions);
	languages.registerCodeLensProvider({ language: "json", pattern: "**/package.json" }, new AnnotationProvider());
}

export function deactivate() {
	if (disposables)
		disposables.forEach(item => item.dispose());
	disposables = [];
}
