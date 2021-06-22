import { aliasHelp, aliasHelpSync } from '@src/alias-help';
import test from 'ava';
import ll from '@src/ll';
import path from 'path';

const log = ll(__filename);

test('webpack-alias-from-tsconfig-sync', (t) => {
  const result = aliasHelpSync({ configFile: 'tsconfig.for.test.json' });
  const expect = {
    '@src': 'src',
    '@samsubdir': 'src/sample-sub-dir',
    '@samdir': '../sample-dir',
    '@avengers': '../ironman',
  };

  log('aliasHelp converted: ', result);

  t.deepEqual(result, expect);
});

test('webpack-alias-from-tsconfig-abs-sync', (t) => {
  const cwd = process.cwd();
  const result = aliasHelpSync({ configFile: 'tsconfig.for.test.json', useAbsolute: true });
  const expect = {
    '@src': path.join(cwd, 'src'),
    '@samsubdir': path.join(cwd, 'src/sample-sub-dir'),
    '@samdir': path.resolve(path.join(cwd, '../sample-dir')),
    '@avengers': path.resolve(path.join(cwd, '../ironman')),
  };

  log('aliasHelp converted: ', result);

  t.deepEqual(result, expect);
});

test('webpack-alias-from-tsconfig', async (t) => {
  const result = await aliasHelp({ configFile: 'tsconfig.for.test.json' });
  const expect = {
    '@src': 'src',
    '@samsubdir': 'src/sample-sub-dir',
    '@samdir': '../sample-dir',
    '@avengers': '../ironman',
  };

  log('aliasHelp converted: ', result);

  t.deepEqual(result, expect);
});

test('webpack-alias-from-tsconfig-abs', async (t) => {
  const cwd = process.cwd();
  const result = await aliasHelp({ configFile: 'tsconfig.for.test.json', useAbsolute: true });
  const expect = {
    '@src': path.join(cwd, 'src'),
    '@samsubdir': path.join(cwd, 'src/sample-sub-dir'),
    '@samdir': path.resolve(path.join(cwd, '../sample-dir')),
    '@avengers': path.resolve(path.join(cwd, '../ironman')),
  };

  log('aliasHelp converted: ', result);

  t.deepEqual(result, expect);
});
