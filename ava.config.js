const config = {
  files: [
    '**/__tests__/*.(ts|tsx)',
    '**/__test__/*.(ts|tsx)',
    '**/__tests__/!*.d.(ts|tsx)',
    '**/__test__/!*.d.(ts|tsx)',
    '!dist',
    '!artifact',
  ],
  extensions: ['ts'],
  concurrency: 8,
  failFast: true,
  failWithoutAssertions: false,
  verbose: true,
  require: ['ts-node/register', 'tsconfig-paths/register'],
  nodeArguments: ['--trace-deprecation', '--napi-modules'],
};

export default config;
