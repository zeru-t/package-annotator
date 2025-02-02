import { workspace } from 'vscode';

const getConfiguration = <T>(key: string) => workspace.getConfiguration('PackageAnnotator').get<T>(key);
export const hideWarning = () => getConfiguration<boolean>('hideMissingAnnotationsWarning');
export const hideButton = () => getConfiguration<boolean>('hideGenerateAnnotationsButton');