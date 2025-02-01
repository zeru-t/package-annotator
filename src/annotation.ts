import { CodeLensProvider, CodeLens, Event, EventEmitter, workspace, TextDocument, CancellationToken } from 'vscode';

export class AnnotationProvider implements CodeLensProvider {

	private codeLenses: CodeLens[] = [];
	private _onDidChangeCodeLenses: EventEmitter<void> = new EventEmitter<void>();
	public readonly onDidChangeCodeLenses: Event<void> = this._onDidChangeCodeLenses.event;

	constructor() {
		workspace.onDidChangeConfiguration((_) => {
			this._onDidChangeCodeLenses.fire();
		});
	}

	public async provideCodeLenses(document: TextDocument, _token: CancellationToken) {
		let addCodeLens = false;
		this.codeLenses = [];

		const newPath = document.uri.path.replace('.json', '.annotations.json');
		const doc = await workspace.openTextDocument(newPath);
		const annotations = JSON.parse(doc.getText()) as Annotation;

		for (let i = 0; i < document.lineCount; i++) {
			const { text: lineText, range } = document.lineAt(i);
			const text = lineText.trim();
			
			if (!text.length || text.startsWith('}')) {
				addCodeLens = false;
				continue;
			}

			if (addCodeLens) {
				const regex = /"(.+)(": ".+")/g;
				const match = regex.exec(text);
				if (match?.length !== 3)
					continue;

				const description = annotations[match[1]];
				if (!description)
					continue;

				this.codeLenses.push(new CodeLens(range, {
					title: description,
					command: "",
				}));
			}
			if (text.includes('"scripts":'))
				addCodeLens = true;
		}
		return this.codeLenses;
	}

	public resolveCodeLens(codeLens: CodeLens, _token: CancellationToken) {
		return codeLens;
	}
}

type Annotation = Record<string, string>;