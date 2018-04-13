module.exports = function typescript(options) {
  return {
    compilerOptions: {
      allowJs: false,
      allowSyntheticDefaultImports: true,
      declaration: true,
      esModuleInterop: true,
      forceConsistentCasingInFileNames: true,
      lib: ['dom', 'esnext'],
      noImplicitReturns: true,
      outDir: './lib',
      pretty: true,
      removeComments: true,
      sourceMap: false,
      strict: true,
      target: 'es5',
    },
    exclude: ['*.test.ts'],
    include: ['./src/**/*', './types/**/*', '../../types/**/*'],
  };
};
