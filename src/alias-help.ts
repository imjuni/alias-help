import { exists, existsSync } from '@src/exists';
import { fpRemoveGlob, fpRemoveGlobForWebpack, fpRemoveGlobWithForceFirst } from '@src/glob';
import ll from '@src/ll';
import { readTsconfig } from '@src/tshelp';
import { isEmpty, isFalse, isNotEmpty, isTrue } from 'my-easy-fp';
import path from 'path';

interface IAliasHelpOption {
  configFile: string;
  useAbsolute?: boolean;
  webpack5?: boolean;
}

const log = ll(__filename);

const getUseAbsolute = (option: IAliasHelpOption) => {
  return isNotEmpty(option.useAbsolute) && isTrue(option.useAbsolute);
};

export function convertAliasHelp({
  tsconfigPath,
  option,
}: {
  tsconfigPath: string;
  option: IAliasHelpOption;
}): Record<string, string | string[]> {
  const tsconfig = readTsconfig(tsconfigPath);

  if (
    tsconfig.options.baseUrl === undefined ||
    tsconfig.options.baseUrl === null ||
    tsconfig.options.paths === undefined ||
    tsconfig.options.paths === null
  ) {
    throw new Error(
      'If you want set module resolution by paths option, must set baseUrl and paths option in tsconfig.json',
    );
  }

  // tsconfig.options.baseUrl is already resolved, that is absolute path
  const baseUrl = tsconfig.options.baseUrl;
  const moduleResolutions = tsconfig.options.paths;
  const aliasConfig = Object.keys(moduleResolutions).reduce<Record<string, string | string[]>>((resolution, key) => {
    const value = moduleResolutions[key];
    const globRemoved =
      isNotEmpty(option.webpack5) && option.webpack5
        ? fpRemoveGlobForWebpack(value)
        : fpRemoveGlobWithForceFirst(value);

    if (isEmpty(globRemoved)) {
      return resolution;
    }

    log(
      'detect webpack5 config: ',
      isNotEmpty(option.webpack5) && isTrue(option.webpack5),
      option.webpack5,
      globRemoved,
    );

    if (Array.isArray(globRemoved) && getUseAbsolute(option)) {
      resolution[fpRemoveGlob(key)] = globRemoved.map((pathElement) =>
        path.resolve(path.dirname(tsconfigPath), path.join(baseUrl, pathElement)),
      );
    } else if (!Array.isArray(globRemoved) && getUseAbsolute(option)) {
      resolution[fpRemoveGlob(key)] = path.resolve(path.dirname(tsconfigPath), path.join(baseUrl, globRemoved));
    } else if (Array.isArray(globRemoved) && isFalse(getUseAbsolute(option))) {
      resolution[fpRemoveGlob(key)] = globRemoved.map((pathElement) =>
        path.relative(path.dirname(tsconfigPath), path.join(baseUrl, pathElement)),
      );
    } else if (!Array.isArray(globRemoved) && isFalse(getUseAbsolute(option))) {
      resolution[fpRemoveGlob(key)] = path.relative(path.dirname(tsconfigPath), path.join(baseUrl, globRemoved));
    }

    return resolution;
  }, {});

  log('compilerOptions: ', aliasConfig);

  return aliasConfig;
}

export function aliasHelpSync(option: IAliasHelpOption) {
  const tsconfigPath = path.resolve(option.configFile);

  if (isFalse(existsSync(tsconfigPath))) {
    throw new Error(`Invalid configFile path: ${tsconfigPath}`);
  }

  return convertAliasHelp({ tsconfigPath, option });
}

export async function aliasHelp(option: IAliasHelpOption) {
  const tsconfigPath = path.resolve(option.configFile);

  if (isFalse(await exists(tsconfigPath))) {
    throw new Error(`Invalid configFile path: ${tsconfigPath}`);
  }

  return convertAliasHelp({ tsconfigPath, option });
}
