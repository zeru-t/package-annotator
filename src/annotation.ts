import { CodeLensProvider, CodeLens, CancellationToken, TextDocument, workspace } from 'vscode';

export class AnnotationProvider implements CodeLensProvider {

	constructor() {}

	public async provideCodeLenses(document: TextDocument, _token: CancellationToken) {
		const docText = document.getText().trim();
		const scriptsTextMatch = /(.+"scripts":\s*{\n\s*)(.+?)(\s*})/gs.exec(docText);

		if (scriptsTextMatch?.length !== 4)
			return [];

		const [ _, scriptsStartText, scripts ] = scriptsTextMatch;

		const annotationsFilePath = document.uri.path.replace('.json', '.annotations.json');
		const annotationsFile = await workspace.openTextDocument(annotationsFilePath);
		const annotations = JSON.parse(annotationsFile.getText()) as Annotation;

		const scriptsStart = scriptsStartText.split('\n').length - 1;
		return scripts
			.split('\n')
			.map((script, index) => {
				const scriptNameMatch = /"(.+)(": ".+")/g.exec(script.trim());
				if (scriptNameMatch?.length !== 3)
					return null;

				const [ _, scriptName ] = scriptNameMatch;
				const annotation = annotations[scriptName];
				if (!annotation)
					return null;

				const range = document.lineAt(scriptsStart + index).range;
				const options = { title: annotation, command: "" };
				return new CodeLens(range, options);
			})
			.filter(script => script !== null);
	}

	public resolveCodeLens(codeLens: CodeLens, _token: CancellationToken) {
		return codeLens;
	}
}

type Annotation = Record<string, string>;
