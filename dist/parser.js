"use strict";
// csv with a row for every function to be type-checked
// with the text of the body, and the name of the function
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const fs = require("fs");
const ts = require("byots");
var path = require("path");
;
function parse(fileNames, outFile, options) {
    // const program = ts.createProgram(fileNames, options);
    // const checker = program.getDiagnosticsProducingTypeChecker();
    fileNames.forEach(fileName => {
        // Parse a file
        const sourceFile = ts.createSourceFile(fileName, fs.readFileSync(fileName).toString(), ts.ScriptTarget.ES2015, 
        /*setParentNodes */ true);
        // parse it
        parseNode(sourceFile);
    });
    function parseNode(node) {
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
exports.parse = parse;
parse(process.argv.slice(2), process.argv.slice(3), {
    target: ts.ScriptTarget.Latest, module: ts.ModuleKind.CommonJS, "removeComments": true
});
//# sourceMappingURL=parser.js.map