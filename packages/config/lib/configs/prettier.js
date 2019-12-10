"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
// Package: Run in root
// Workspaces: Run in root
const config = {
    arrowParens: 'avoid',
    bracketSpacing: true,
    ignore: [...constants_1.IGNORE_PATHS, 'book.json', 'lerna.json', 'package.json', 'tsconfig.json', '*.d.ts'],
    jsxBracketSameLine: false,
    printWidth: 100,
    proseWrap: 'always',
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'all',
    useTabs: false,
};
exports.default = config;
