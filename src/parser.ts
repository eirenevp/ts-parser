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

export function parse(fileNames: string[], options: ts.CompilerOptions): void {

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
            fs.appendFileSync("parsedFunctions.csv", node.name.getText() + ',,');
            let body = node.body.getText();
            body = body.replace(/\r?\n|\r/g, " ");
            fs.appendFileSync("parsedFunctions.csv", body + '\n');
            console.log(node.name.getText());
            console.log(node.body.getText());
        }

        ts.forEachChild(node, parseNode);
    }

    // function report(node: ts.Node, message: string) {
    //     const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
    //     console.log(`${sourceFile.fileName} (${line + 1},${character + 1}): ${message}`);
    // }
}


parse(process.argv.slice(2), {
    target:
        ts.ScriptTarget.Latest, module: ts.ModuleKind.CommonJS, "removeComments": true
});

