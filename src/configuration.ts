import { workspace } from 'vscode';

const getConfiguration = <T>(key: string) => workspace.getConfiguration('PackageAnnotator').get<T>(key);
export const extensionDisabled = () => !getConfiguration<boolean>('enabled');
export const ignoreWarning = () => getConfiguration<boolean>('ignoreMissingAnnotationsWarning');
export const showWarning = () => !ignoreWarning() && !extensionDisabled();