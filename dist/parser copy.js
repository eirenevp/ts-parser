"use strict";
// csv with a row for every function to be type-checked
// with the text of the body, and the name of the function
Object.defineProperty(exports, "__esModule", { value: true });
exports.delint = void 0;
const fs_1 = require("fs");
const ts = require("byots");
var path = require("path");
;
function delint(sourceFile) {
    delintNode(sourceFile);
    function delintNode(node) {
        switch (node.kind) {
            case ts.SyntaxKind.ForStatement:
            case ts.SyntaxKind.ForInStatement:
            case ts.SyntaxKind.WhileStatement:
            case ts.SyntaxKind.DoStatement:
                if (node.statement.kind !== ts.SyntaxKind.Block) {
                    report(node, 'A looping statement\'s contents should be wrapped in a block body.');
                }
                break;
            case ts.SyntaxKind.IfStatement:
                const ifStatement = node;
                if (ifStatement.thenStatement.kind !== ts.SyntaxKind.Block) {
                    report(ifStatement.thenStatement, 'An if statement\'s contents should be wrapped in a block body.');
                }
                if (ifStatement.elseStatement &&
                    ifStatement.elseStatement.kind !== ts.SyntaxKind.Block &&
                    ifStatement.elseStatement.kind !== ts.SyntaxKind.IfStatement) {
                    report(ifStatement.elseStatement, 'An else statement\'s contents should be wrapped in a block body.');
                }
                break;
            case ts.SyntaxKind.BinaryExpression:
                const op = node.operatorToken.kind;
                if (op === ts.SyntaxKind.EqualsEqualsToken || op === ts.SyntaxKind.ExclamationEqualsToken) {
                    report(node, 'Use \'===\' and \'!==\'.');
                }
                break;
        }
        ts.forEachChild(node, delintNode);
    }
    function report(node, message) {
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
        console.log(`${sourceFile.fileName} (${line + 1},${character + 1}): ${message}`);
    }
}
exports.delint = delint;
const fileNames = process.argv.slice(2);
fileNames.forEach(fileName => {
    // Parse a file
    const sourceFile = ts.createSourceFile(fileName, fs_1.readFileSync(fileName).toString(), ts.ScriptTarget.ES2015, 
    /*setParentNodes */ true);
    // delint it
    delint(sourceFile);
});
//# sourceMappingURL=parser copy.js.map