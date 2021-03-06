"use strict";
/* eslint-disable no-magic-numbers, sort-keys */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const core_1 = require("@beemo/core");
const constants_1 = require("../constants");
const { tool } = process.beemo;
const { node } = tool.config.settings;
const workspacesEnabled = !!tool.package.workspaces;
let project;
// Lint crashes with an OOM error when using project references,
// so just use a single file that globs everything.
if (workspacesEnabled) {
    project = core_1.Path.resolve('tsconfig.eslint.json');
    const include = [];
    tool.getWorkspacePaths({ relative: true }).forEach((wsPath) => {
        include.push(new core_1.Path(wsPath, 'src/**/*'), new core_1.Path(wsPath, 'tests/**/*'), new core_1.Path(wsPath, 'types/**/*'));
    });
    fs_1.default.writeFileSync(project.path(), JSON.stringify({
        extends: './tsconfig.options.json',
        include: include.map((i) => i.path()),
    }), 'utf8');
}
else {
    project = core_1.Path.resolve('tsconfig.json');
}
// Package: Run in root
// Workspaces: Run in root
const config = {
    root: true,
    parser: '@typescript-eslint/parser',
    extends: ['airbnb', 'prettier', 'prettier/react', 'prettier/@typescript-eslint'],
    plugins: ['react-hooks', 'promise', 'unicorn', 'compat', 'babel', 'security', 'node'],
    ignore: [...constants_1.IGNORE_PATHS, '*.min.js', '*.map'],
    env: {
        browser: true,
    },
    globals: {
        __DEV__: 'readable',
    },
    settings: {
        polyfills: ['promises'],
        'import/extensions': constants_1.EXTS,
        'import/resolver': {
            node: {
                extensions: constants_1.EXTS,
            },
        },
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
    },
    parserOptions: {
        sourceType: 'module',
        // @ts-expect-error Fix Beemo upstream
        ecmaVersion: 2021,
        ecmaFeatures: {
            jsx: true,
        },
    },
    reportUnusedDisableDirectives: true,
    rules: {
        'class-methods-use-this': 'off',
        'multiline-comment-style': 'off',
        'no-else-return': ['error', { allowElseIf: true }],
        'no-invalid-this': 'off',
        'object-curly-spacing': 'off',
        // 'padded-blocks': [
        //   'error',
        //   {
        //     // Never apply to blocks
        //     classes: 'never',
        //     switches: 'never',
        //   },
        // ],
        // BABEL
        'babel/new-cap': 'error',
        'babel/no-invalid-this': 'error',
        'babel/object-curly-spacing': ['error', 'always'],
        'babel/semi': 'error',
        // COMPAT
        'compat/compat': node ? 'off' : 'warn',
        // IMPORT
        'import/prefer-default-export': 'off',
        // PROMISE
        'promise/always-return': 'error',
        'promise/avoid-new': 'off',
        'promise/catch-or-return': 'error',
        'promise/no-callback-in-promise': 'error',
        'promise/no-native': 'off',
        'promise/no-nesting': 'off',
        'promise/no-new-statics': 'error',
        'promise/no-promise-in-callback': 'error',
        'promise/no-return-in-finally': 'error',
        'promise/no-return-wrap': ['error', { allowReject: true }],
        'promise/param-names': 'error',
        'promise/valid-params': 'error',
        // REACT
        'react/sort-prop-types': 'off',
        'react/state-in-constructor': 'off',
        'react/static-property-placement': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/jsx-sort-default-props': 'off',
        // UNICORN
        'unicorn/better-regex': 'error',
        'unicorn/catch-error-name': 'error',
        'unicorn/custom-error-definition': 'error',
        'unicorn/error-message': 'error',
        'unicorn/escape-case': 'error',
        'unicorn/explicit-length-check': 'error',
        'unicorn/filename-case': 'off',
        'unicorn/import-index': 'error',
        'unicorn/new-for-builtins': 'error',
        'unicorn/no-abusive-eslint-disable': 'off',
        'unicorn/no-array-instanceof': 'error',
        'unicorn/no-console-spaces': 'error',
        'unicorn/no-fn-reference-in-iterator': 'error',
        'unicorn/no-for-loop': 'error',
        'unicorn/no-hex-escape': 'error',
        'unicorn/no-new-buffer': 'error',
        'unicorn/no-object-as-default-parameter': 'error',
        'unicorn/no-process-exit': 'error',
        'unicorn/no-unused-properties': 'error',
        'unicorn/no-zero-fractions': 'error',
        'unicorn/number-literal-case': 'error',
        'unicorn/prefer-add-event-listener': 'error',
        'unicorn/prefer-array-find': 'error',
        'unicorn/prefer-event-key': 'error',
        'unicorn/prefer-flat-map': 'error',
        'unicorn/prefer-includes': 'error',
        'unicorn/prefer-modern-dom-apis': 'error',
        'unicorn/prefer-node-append': 'error',
        'unicorn/prefer-node-remove': 'error',
        'unicorn/prefer-number-properties': 'error',
        'unicorn/prefer-starts-ends-with': 'error',
        'unicorn/prefer-string-slice': 'error',
        'unicorn/prefer-ternary': 'error',
        'unicorn/prefer-text-content': 'error',
        'unicorn/prefer-type-error': 'error',
        'unicorn/throw-new-error': 'error',
        // New and not in Airbnb
        'default-param-last': 'warn',
        'no-constructor-return': 'error',
        'no-dupe-else-if': 'error',
        'no-import-assign': 'error',
        'no-promise-executor-return': 'error',
        'no-setter-return': 'error',
        'no-unreachable-loop': 'error',
        'prefer-exponentiation-operator': 'error',
        'prefer-regex-literals': 'error',
        'react/jsx-no-useless-fragment': 'error',
        'react/no-typos': 'error',
        'react/no-unsafe': 'error',
        'react-hooks/exhaustive-deps': 'error',
        'react-hooks/rules-of-hooks': 'error',
        // Want to support but disabled in Airbnb
        complexity: ['error', 11],
        'max-lines-per-function': [
            'off',
            {
                max: 50,
                skipBlankLines: true,
                skipComments: true,
                IIFEs: true,
            },
        ],
        'newline-before-return': 'error',
        'no-constant-condition': 'error',
        'no-div-regex': 'error',
        'no-eq-null': 'error',
        'no-implicit-coercion': 'error',
        'no-loss-of-precision': 'error',
        'no-magic-numbers': [
            'error',
            {
                ignore: [-1, 0, 1, 2, 3],
                ignoreArrayIndexes: true,
                enforceConst: true,
            },
        ],
        'no-native-reassign': 'error',
        'no-negated-condition': 'error',
        'no-useless-call': 'error',
        'require-atomic-updates': 'error',
        'require-unicode-regexp': 'error',
        'sort-keys': [
            'error',
            'asc',
            {
                caseSensitive: false,
                natural: true,
            },
        ],
        'import/default': 'off',
        'import/no-anonymous-default-export': [
            'error',
            {
                allowArray: true,
                allowLiteral: true,
                allowObject: true,
            },
        ],
        'react/forbid-foreign-prop-types': 'error',
        'react/jsx-handler-names': [
            'error',
            {
                eventHandlerPrefix: 'handle',
                eventHandlerPropPrefix: 'on',
            },
        ],
        'react/jsx-key': 'error',
        'react/jsx-no-literals': ['error', { ignoreProps: true }],
        'react/no-did-mount-set-state': 'error',
        'react/no-direct-mutation-state': 'error',
        // Doesnt work with Prettier
        'function-paren-newline': 'off',
        'react/jsx-one-expression-per-line': 'off',
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            plugins: ['@typescript-eslint'],
            parserOptions: {
                project: project.path(),
            },
            rules: {
                camelcase: 'off',
                'no-unused-vars': 'off',
                'no-void': 'off',
                'import/extensions': [
                    'error',
                    'never',
                    {
                        json: 'always',
                    },
                ],
                'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'] }],
                '@typescript-eslint/adjacent-overload-signatures': 'error',
                '@typescript-eslint/array-type': ['error', { default: 'array' }],
                '@typescript-eslint/consistent-type-assertions': [
                    'error',
                    {
                        assertionStyle: 'as',
                        objectLiteralTypeAssertions: 'allow-as-parameter',
                    },
                ],
                '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
                '@typescript-eslint/member-delimiter-style': 'error',
                '@typescript-eslint/member-ordering': 'error',
                '@typescript-eslint/method-signature-style': 'error',
                '@typescript-eslint/naming-convention': [
                    'off',
                    { selector: 'variableLike', format: ['camelCase'] },
                    { selector: 'memberLike', format: ['camelCase'] },
                    { selector: 'typeLike', format: ['PascalCase'] },
                    {
                        selector: 'variable',
                        format: ['camelCase', 'UPPER_CASE'],
                        leadingUnderscore: 'allow',
                        trailingUnderscore: 'allow',
                    },
                    { selector: 'property', format: ['camelCase', 'UPPER_CASE'] },
                    { selector: 'enumMember', format: ['camelCase', 'UPPER_CASE'] },
                ],
                '@typescript-eslint/no-array-constructor': 'error',
                '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreVoidOperator: true }],
                '@typescript-eslint/no-empty-interface': 'error',
                '@typescript-eslint/no-explicit-any': ['error', { ignoreRestArgs: true }],
                '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: true }],
                '@typescript-eslint/no-inferrable-types': [
                    'error',
                    {
                        ignoreProperties: true,
                        ignoreParameters: true,
                    },
                ],
                '@typescript-eslint/no-misused-new': 'error',
                '@typescript-eslint/no-misused-promises': 'error',
                '@typescript-eslint/no-namespace': 'error',
                '@typescript-eslint/no-parameter-properties': 'error',
                '@typescript-eslint/no-unnecessary-condition': [
                    'off',
                    { allowConstantLoopConditions: true },
                ],
                '@typescript-eslint/no-unnecessary-qualifier': 'error',
                '@typescript-eslint/no-unnecessary-type-constraint': 'error',
                '@typescript-eslint/no-unsafe-assignment': 'error',
                '@typescript-eslint/no-unused-vars': [
                    'error',
                    { vars: 'all', args: 'none', ignoreRestSiblings: true },
                ],
                '@typescript-eslint/no-use-before-define': 'error',
                '@typescript-eslint/no-var-requires': 'off',
                '@typescript-eslint/prefer-namespace-keyword': 'error',
                '@typescript-eslint/prefer-optional-chain': 'error',
                '@typescript-eslint/prefer-readonly': 'off',
                '@typescript-eslint/prefer-reduce-type-parameter': 'error',
                '@typescript-eslint/prefer-ts-expect-error': 'error',
                '@typescript-eslint/require-await': 'warn',
                '@typescript-eslint/triple-slash-reference': 'error',
                '@typescript-eslint/unified-signatures': 'error',
                '@typescript-eslint/type-annotation-spacing': 'error',
                // Doesnt work with TypeScript
                'no-restricted-globals': 'off',
                'no-undef': 'off',
                'import/no-cycle': 'off',
                'import/named': 'off',
                'react/destructuring-assignment': 'off',
                'unicorn/no-fn-reference-in-iterator': 'off',
                'unicorn/no-keyword-prefix': 'off',
                'unicorn/prefer-spread': 'off',
            },
        },
        {
            files: ['*.tsx'],
            plugins: ['@typescript-eslint'],
            rules: {
                'react/sort-comp': [
                    'error',
                    {
                        order: [
                            'statics',
                            'properties',
                            'lifecycle',
                            'everything-else',
                            'handlers',
                            'renderers',
                        ],
                        groups: {
                            statics: ['propTypes', 'defaultProps'],
                            properties: [
                                '/^(?!on).+$/',
                                '/^(?!handle).+$/',
                                '/^(?!render).+$/',
                                '/^.+Ref$/',
                                'state',
                            ],
                            lifecycle: [
                                'constructor',
                                'getDerivedStateFromProps',
                                'componentDidMount',
                                'shouldComponentUpdate',
                                'getSnapshotBeforeUpdate',
                                'componentDidUpdate',
                                'componentDidCatch',
                                'componentWillUnmount',
                            ],
                            handlers: ['/^on.+$/', '/^handle.+$/'],
                            renderers: ['/^render.+$/', 'render'],
                        },
                    },
                ],
                '@typescript-eslint/member-ordering': 'off',
                '@typescript-eslint/no-explicit-any': 'off',
            },
        },
        {
            files: [`*.test.${constants_1.EXT_PATTERN}`, 'test.ts'],
            plugins: ['jest'],
            env: {
                jest: true,
                node: true,
            },
            rules: {
                'max-classes-per-file': 'off',
                'no-console': 'off',
                'no-magic-numbers': 'off',
                'sort-keys': 'off',
                'compat/compat': 'off',
                'import/no-extraneous-dependencies': 'off',
                'jest/expect-expect': 'error',
                'jest/no-alias-methods': 'error',
                'jest/no-disabled-tests': 'error',
                'jest/no-done-callback': 'error',
                'jest/no-duplicate-hooks': 'error',
                'jest/no-expect-resolves': 'error',
                'jest/no-export': 'error',
                'jest/no-focused-tests': 'error',
                'jest/no-identical-title': 'error',
                'jest/no-if': 'error',
                'jest/no-jasmine-globals': 'error',
                'jest/no-jest-import': 'error',
                'jest/no-standalone-expect': 'error',
                'jest/no-test-prefixes': 'error',
                'jest/no-test-return-statement': 'error',
                'jest/prefer-hooks-on-top': 'error',
                'jest/prefer-spy-on': 'error',
                'jest/prefer-todo': 'error',
                'jest/prefer-to-be-null': 'error',
                'jest/prefer-to-be-undefined': 'error',
                'jest/prefer-to-contain': 'error',
                'jest/prefer-to-have-length': 'error',
                'jest/require-to-throw-message': 'error',
                'jest/require-top-level-describe': 'error',
                'jest/valid-describe': 'error',
                'jest/valid-expect': 'error',
                'jest/valid-title': 'error',
                // TYPESCRIPT
                '@typescript-eslint/no-explicit-any': 'off',
                '@typescript-eslint/no-floating-promises': 'off',
                '@typescript-eslint/no-unsafe-assignment': 'off',
            },
        },
    ],
};
if (node) {
    const tryExtensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.node'];
    Object.assign(config.rules, {
        // NODE
        'node/no-callback-literal': 'error',
        'node/no-deprecated-api': 'error',
        'node/no-exports-assign': 'error',
        'node/no-missing-import': ['error', { tryExtensions }],
        'node/no-missing-require': ['error', { tryExtensions }],
        'node/no-unpublished-bin': 'error',
        'node/no-unsupported-features/node-builtins': 'error',
        'node/prefer-global/buffer': 'error',
        'node/prefer-global/console': 'error',
        'node/prefer-global/process': 'error',
        'node/prefer-promises/dns': 'off',
        'node/prefer-promises/fs': 'off',
        'node/process-exit-as-throw': 'error',
        'node/shebang': 'error',
        // SECURITY
        'security/detect-buffer-noassert': 'error',
        'security/detect-child-process': 'error',
        'security/detect-disable-mustache-escape': 'error',
        'security/detect-eval-with-expression': 'error',
        'security/detect-non-literal-regexp': 'error',
        'security/detect-possible-timing-attacks': 'error',
        'security/detect-pseudoRandomBytes': 'error',
        'security/detect-unsafe-regex': 'error',
    });
}
exports.default = config;
