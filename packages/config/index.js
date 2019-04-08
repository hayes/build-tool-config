/* eslint-disable no-param-reassign */

const fs = require('fs-extra');
const path = require('path');
const { EXTS, DIR_PATTERN, CJS_FOLDER, ESM_FOLDER } = require('./constants');

const extsWithoutJSON = EXTS.filter(ext => ext !== '.json');

function hasNoPositionalArgs(context, name) {
  const args = context.args._;

  return args.length === 0 || (args.length === 1 && args[0] === name);
}

module.exports = function milesOSS(tool) {
  const usingTypeScript = tool.isPluginEnabled('driver', 'typescript');
  const workspacesEnabled = !!tool.package.workspaces;
  const workspacePrefixes = tool.getWorkspacePaths({ relative: true });

  // Babel
  tool.on('babel.init-driver', context => {
    context.addOption('--copy-files');

    if (usingTypeScript && !context.args.extensions) {
      context.addOption('--extensions', extsWithoutJSON.join(','));
    }

    if (hasNoPositionalArgs(context, 'babel')) {
      context.addArg('src');
      context.addOption('--out-dir', context.args.esm ? ESM_FOLDER : CJS_FOLDER);
    }
  });

  // ESLint
  tool.on('eslint.init-driver', context => {
    context.addOptions(['--color', '--report-unused-disable-directives']);

    if (usingTypeScript && !context.args.ext) {
      context.addOption('--ext', extsWithoutJSON.join(','));
    }

    if (hasNoPositionalArgs(context, 'eslint')) {
      if (workspacesEnabled) {
        workspacePrefixes.forEach(wsPrefix => {
          context.addArg(path.join(wsPrefix, DIR_PATTERN));
        });
      } else {
        context.addArgs(['src', 'tests']);
      }
    }
  });

  // Jest
  tool.on('jest.init-driver', (context, driver) => {
    context.addOptions(['--colors', '--logHeapUsage']);

    if (context.argv.includes('--coverage')) {
      context.addOption('--detectOpenHandles');
    }

    if (usingTypeScript) {
      driver.options.dependencies.push('typescript');
    }

    driver.options.env.NODE_ENV = 'test';
    driver.options.env.TZ = 'UTC';
  });

  // Prettier
  tool.on('prettier.init-driver', context => {
    context.addOption('--write');

    if (hasNoPositionalArgs(context, 'prettier')) {
      const exts = '{ts,tsx,js,jsx,scss,css,gql,yml,yaml}';

      if (workspacesEnabled) {
        workspacePrefixes.forEach(wsPrefix => {
          context.addArgs([
            path.join(wsPrefix, DIR_PATTERN, `**/*.${exts}`),
            path.join(wsPrefix, '*.{md,json}'),
          ]);
        });
      } else {
        context.addArgs([path.join(DIR_PATTERN, `**/*.${exts}`), '*.{md,json}']);
      }
    }

    context.addArgs(['docs/**/*.md', 'README.md']);
  });

  // TypeScript
  if (workspacesEnabled) {
    tool.on('typescript.after-execute', () => {
      const corePackage = path.join(tool.options.root, 'packages/core');

      if (fs.existsSync(corePackage))
        fs.copySync(path.join(tool.options.root, 'README.md'), path.join(corePackage, 'README.md'));
    });
  }
};
