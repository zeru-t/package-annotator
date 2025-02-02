# Package Annotator

<img src="images/logo.png" alt="Package Annotator logo" width="12%" />

Package Annotator is a VS Code extension that adds user defined annotations to the "scripts" section of *package.json* files.

## Setup
Annotations are stored in a *package.annotations.json* file in the same directory as the *package.json* file.
1. Use the Annotations Generator to create a *package.annotations.json* file for every *package.json* file in your workspace.

   <img src="images/generate.png" alt="Package Annotator logo" width="12%" />

2. Add annotations to the *package.annotations.json* file.
3. Annotations will appear in the *package.json* file:

	<img src="images/screenshot.png" alt="sample annotation screenshot" width="45%"/>

4. (OPTIONAL) Add 'package.annotations.json' to the list off file patterns to nest under *package.json* files in the Explorer's [File Nesting Patterns](vscode://settings/explorer.fileNesting.patterns) VS Code settings

#### **Note: [`Editor Code Lens`](vscode://settings/editor.codeLens) must be enabled in VS Code settings for the annotations to appear.**


## Settings

### `"PackageAnnotator.enabled"`
This setting enables or disables the extension.
* Options: `true` OR `FALSE`
* _Default: `true`_

### `"PackageAnnotator.hideMissingAnnotationsWarning"`
This setting ignores the *'missing annotations'* status bar warning.
* Options: `true` OR `FALSE`
* _Default: `false`_