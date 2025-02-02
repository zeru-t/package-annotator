import { ExtensionContext, Disposable, languages } from 'vscode';
import { AnnotationProvider } from './annotation';
import { createStatusBarItem } from './status-bar';
import { extensionDisabled } from './configuration';


let disposables: Disposable[] = [];

export async function activate(_context: ExtensionContext) {
	if (extensionDisabled())
		return;

	await createStatusBarItem(_context.subscriptions);
	languages.registerCodeLensProvider({ language: 'json', pattern: '**/package.json' }, new AnnotationProvider());
}

export function deactivate() {
	if (disposables)
		disposables.forEach(item => item.dispose());
	disposables = [];
}
