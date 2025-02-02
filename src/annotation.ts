import { CodeLensProvider, CodeLens, CancellationToken, TextDocument, workspace, window, Uri } from 'vscode';


const defaultAnnotations = {
	'SCRIPT_1': 'SCRIPT_1 DESCRIPTION',
	'SCRIPT_2': 'SCRIPT_2 DESCRIPTION',
	'SCRIPT_3': 'SCRIPT_3 DESCRIPTION'
};
let allAnnotations: Record<string, Annotation|null>;
export async function getAnnotations() {
	if (!allAnnotations)
		allAnnotations = {};

	const packageFiles = await workspace.findFiles('**/package.json', '**/node_modules/**');
	for await (const { path: packagePath } of packageFiles) {
		const annotationsPath = getAnnotationsPath(packagePath);
		try {
			const annotationsFile = await workspace.openTextDocument(annotationsPath);
			allAnnotations[annotationsPath] = JSON.parse(annotationsFile.getText());
		}
		catch (e) {
			allAnnotations[annotationsPath] = null;
		}
	}
}
export async function createAnnotationFiles() {
	const packageFiles = await workspace.findFiles('**/package.json', '**/node_modules/**');
	packageFiles
		.filter(({ path }) => {
			const annotationsPath = getAnnotationsPath(path);
			const annotations = allAnnotations[annotationsPath];
			return annotations === null;
		})
		.forEach(async ({ path: packageFilePath }) => {
			const annotationsPath = Uri.file(getAnnotationsPath(packageFilePath));
			await workspace.fs.writeFile(annotationsPath, Buffer.from(JSON.stringify(defaultAnnotations, null, 4)));
			await window.showTextDocument(annotationsPath);
		});
}
export const missingAnnotationFiles = () => Object.values(allAnnotations).some(exists => !exists);
const getAnnotationsPath = (path: string) => path.replace('package.json', 'package.annotations.json');

export class AnnotationProvider implements CodeLensProvider {

	constructor() {}

	public async provideCodeLenses(document: TextDocument, _token: CancellationToken) {

		const annotationsPath = getAnnotationsPath(document.uri.path);
		const annotations = allAnnotations[annotationsPath];
		if (!annotations)
			return [];

		const documentText = document.getText();
		const scriptsTextMatch = /(.+"scripts":\s*{[\r\n]+\s*)(.+?)(\s*})/gs.exec(documentText);
		if (scriptsTextMatch?.length !== 4)
			return [];

		const [ _, scriptsStartText, scripts ] = scriptsTextMatch;
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
				const options = { title: annotation, command: '' };
				return new CodeLens(range, options);
			})
			.filter(script => script !== null);
	}

	public resolveCodeLens(codeLens: CodeLens, _token: CancellationToken) {
		return codeLens;
	}
}

type Annotation = Record<string, string>;
