// csv with a row for every function to be type-checked
// with the text of the body, and the name of the function

import * as fs from "fs";
import * as ts from "byots";
var path = require("path");

interface INodeEntry {
    node?: string;
    loc?: number;
    type?: string;
    name?: string;
    children?: INodeEntry[];
    statement?: string;
};

export function parse(fileNames: string[], outFile: string[], options: ts.CompilerOptions): void {

    // const program = ts.createProgram(fileNames, options);
    // const checker = program.getDiagnosticsProducingTypeChecker();
    fileNames.forEach(fileName => {
        // Parse a file
        const sourceFile = ts.createSourceFile(
            fileName,
            fs.readFileSync(fileName).toString(),
            ts.ScriptTarget.ES2015,
          /*setParentNodes */ true
        );

        // parse it
        parseNode(sourceFile);
    });
    function parseNode(node: ts.Node) {
        if (ts.isFunctionDeclaration(node)) {
            fs.appendFileSync(outFile[0], '"' + fileNames[0] + '"' + ',');
            fs.appendFileSync(outFile[0], '"' + node.name.getText() + '"' + ',');
            if (node.body != undefined) {
                let body = node.body.getText().replace(/\"/g, "'");
                body = '"' + body.replace(/\r?\n|\r|\t|\s{2,}/g, " ") + '"';
                fs.appendFileSync(outFile[0], body + '\n');
            }
            else {
                fs.appendFileSync(outFile[0], '"' + "no body" + '"' + '\n');
            }
            // console.log(node.name.getText());
            // console.log(node.body.getText());
        }

        ts.forEachChild(node, parseNode);
    }
}


parse(process.argv.slice(2), process.argv.slice(3), {
    target:
        ts.ScriptTarget.Latest, module: ts.ModuleKind.CommonJS, "removeComments": true
});

