"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var import_vscode2 = require("vscode");

// src/annotation.ts
var import_vscode = require("vscode");
var AnnotationProvider = class {
  codeLenses = [];
  _onDidChangeCodeLenses = new import_vscode.EventEmitter();
  onDidChangeCodeLenses = this._onDidChangeCodeLenses.event;
  constructor() {
    import_vscode.workspace.onDidChangeConfiguration((_) => {
      this._onDidChangeCodeLenses.fire();
    });
  }
  async provideCodeLenses(document, _token) {
    let addCodeLens = false;
    this.codeLenses = [];
    const newPath = document.uri.path.replace(".json", ".annotations.json");
    const doc = await import_vscode.workspace.openTextDocument(newPath);
    const annotations = JSON.parse(doc.getText());
    for (let i = 0; i < document.lineCount; i++) {
      const { text: lineText, range } = document.lineAt(i);
      const text = lineText.trim();
      if (!text.length || text.startsWith("}")) {
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
        this.codeLenses.push(new import_vscode.CodeLens(range, {
          title: description,
          command: ""
        }));
      }
      if (text.includes('"scripts":'))
        addCodeLens = true;
    }
    return this.codeLenses;
  }
  resolveCodeLens(codeLens, _token) {
    return codeLens;
  }
};

// src/extension.ts
var disposables = [];
function activate(_context) {
  import_vscode2.languages.registerCodeLensProvider({ language: "json", pattern: "**/package.json" }, new AnnotationProvider());
}
function deactivate() {
  if (disposables)
    disposables.forEach((item) => item.dispose());
  disposables = [];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
