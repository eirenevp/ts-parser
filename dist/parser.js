"use strict";
// csv with a row for every function to be type-checked
// with the text of the body, and the name of the function
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const fs = __importStar(require("fs"));
//import * as ts from "byots";
const ts = __importStar(require("typescript"));
var path = require("path");
;
function parse(fileNames, outFile, options) {
    const program = ts.createProgram(fileNames, options);
    const checker = program.getTypeChecker();
    const mainSourceFile = program.getSourceFiles().filter(x => (program.getRootFileNames()[0]).includes(x.fileName))[0];
    ts.forEachChild(mainSourceFile, parseNode);
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
            const symbol = checker.getSymbolAtLocation(node.name);
            const type = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
            const signType = type.getCallSignatures()[0];
            signType.parameters.forEach(param => {
                fs.appendFileSync(outFile[0], '"' + fileNames[0] + '"' + ',');
                fs.appendFileSync(outFile[0], '"' + node.name.getText() + '"' + ',');
                fs.appendFileSync(outFile[0], '"' + param.getName() + '"' + ',');
                let paramType = checker.getTypeOfSymbolAtLocation(param, param.valueDeclaration);
                fs.appendFileSync(outFile[0], '"' + checker.typeToString(paramType) + '"' + '\n');
                // console.log(checker.typeToString(paramType));
            });
            fs.appendFileSync(outFile[0], '"' + fileNames[0] + '"' + ',');
            fs.appendFileSync(outFile[0], '"' + node.name.getText() + '"' + ',');
            fs.appendFileSync(outFile[0], '"' + "funRet" + '"' + ',');
            const returnType = checker.typeToString(signType.getReturnType());
            fs.appendFileSync(outFile[0], '"' + returnType + '"' + '\n');
            // if (node.body != undefined) {
            //     let body = node.body.getText().replace(/\"/g, "'");
            //     body = '"' + body.replace(/\r?\n|\r|\t|\s{2,}/g, " ") + '"';
            //     fs.appendFileSync(outFile[0], body + '\n');
            // }
            // else {
            //     fs.appendFileSync(outFile[0], '"' + "no body" + '"' + '\n');
            // }
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