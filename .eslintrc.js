module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        "project": "./tsconfig.json",
        plugins: [
            '@typescript-eslint',
        ],
        // "rules": {
        //     "@typescript-eslint/no-floating-promises": "error",
        //     "@typescript-eslint/ no-unnecessary-type-assertion": "error",
        //     "@typescript-eslint/explicit-function-return-type": "error"
        // },
        extends: [
            'eslint:recommended',
            'plugin:@typescript-eslint/recommended',
            "plugin:@typescript-eslint/recommended-requiring-type-checking",
        ],
        "overrides": [
            {
                // enable the rule specifically for TypeScript files
                "files": ["*.ts", "*.tsx"],
                "rules": {
                    "@typescript-eslint/explicit-function-return-type": ["error"]
                }
            }
        ]
    };