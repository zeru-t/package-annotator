
import { ExtensionContext, languages, commands, Disposable, window } from 'vscode';
import { AnnotationProvider } from './annotation';

let disposables: Disposable[] = [];

export function activate(_context: ExtensionContext) {
	languages.registerCodeLensProvider({ language: "json", pattern: "**/package.json" }, new AnnotationProvider());
}

export function deactivate() {
	if (disposables)
		disposables.forEach(item => item.dispose());
	disposables = [];
}
