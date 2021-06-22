import { logger, option, task, series, argv } from 'just-scripts';
import { exec } from 'just-scripts-utils';
import * as uuid from 'uuid';

option('env', { default: { env: 'develop' } });

function getEnvironmentPrefix(env: Record<string, string | boolean>): string {
  const envPrefix = Object.entries(env)
    .map(([key, value]) => `${key}=${value}`)
    .join(' ');

  return envPrefix;
}

task('uuid', () => {
  const uid = uuid.v4();

  logger.info('UUID-1: ', uid.replace(/-/g, ''));
  logger.info('UUID-2: ', uid);
});

task('lint', async () => {
  const cmd = 'eslint "**/*.{ts,tsx}"';

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('clean', async () => {
  const cmd = 'rimraf dist artifact';

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('+pub', async () => {
  const cmd = 'npm publish --registry http://localhost:8901 --force';

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('+pub:prod', async () => {
  const cmd = 'npm publish --registry https://registry.npmjs.org --access=public';

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('+build:dev', async () => {
  const env = {
    DEBUG: 'frm:*',
    NODE_ENV: 'production',
  };

  const cmd = `${getEnvironmentPrefix(env)} webpack --config webpack.config.dev.js`;

  logger.info('Script Build: ', cmd);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('+build:prod', async () => {
  const env = {
    DEBUG: 'frm:*',
    NODE_ENV: 'production',
  };

  const cmd = `${getEnvironmentPrefix(env)} webpack --config webpack.config.prod.js`;

  logger.info('Script Build: ', cmd);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('tsc', async () => {
  const cmd = `NODE_ENV=production tsc --project ./tsconfig.dev.json  --incremental`;
  logger.info('TypeScript compiler build: ', cmd);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('test', async () => {
  const env = {
    DEBUG: 'aliashelp:*',
    ENV_APPLICATION_LOG_LEVEL: 'debug',
  };

  const enableNotification = process.env.ENV_ENABLE_NOTIFICATION === 'true';

  const envPrefix = Object.entries(env)
    .map(([key, value]) => `${key}=${value}`)
    .join(' ');

  const testPath = argv()._[1] ?? '';
  const cmd = enableNotification ? `${envPrefix} ava ${testPath} | tap-notify` : `${envPrefix} ava ${testPath}`;

  // `${envPrefix} ava --color --fail-fast --verbose --tap ${testPath} | tap-notify | tap-nyan`
  logger.info('Ava test: ', cmd, testPath);

  await exec(cmd, {
    stderr: process.stderr,
    stdout: process.stdout,
  });
});

task('build', series('clean', 'lint', '+build:dev'));
task('pub:dev', series('clean', 'lint', '+build:dev', '+pub'));
task('pub:prod', series('clean', 'lint', '+build:prod', '+pub:prod'));
task('build:dev', series('clean', 'lint', '+build:dev'));
task('build:prod', series('clean', 'lint', '+build:prod'));
