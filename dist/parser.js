"use strict";
// csv with a row for every function to be type-checked
// with the text of the body, and the name of the function
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const fs = require("fs");
const ts = require("byots");
var path = require("path");
;
function parse(fileNames, options) {
    const program = ts.createProgram(fileNames, options);
    // const checker = program.getDiagnosticsProducingTypeChecker();
    const sourceFile = program.getSourceFileByPath(program.getRootFileNames()[0]);
    parseNode(sourceFile);
    // fileNames.forEach(fileName => {
    //     // Parse a file
    //     const sourceFile = ts.createSourceFile(
    //         fileName,
    //         fs.readFileSync(fileName).toString(),
    //         ts.ScriptTarget.ES2015,
    //       /*setParentNodes */ true
    //     );
    //     // parse it
    //     parseNode(sourceFile);
    // });
    function parseNode(node) {
        if (ts.isFunctionDeclaration(node)) {
            fs.appendFileSync("parsedFunctions.csv", node.name.getText() + ',');
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
exports.parse = parse;
parse(process.argv.slice(2), {
    target: ts.ScriptTarget.Latest, module: ts.ModuleKind.CommonJS, "removeComments": true
});
//# sourceMappingURL=parser.js.map