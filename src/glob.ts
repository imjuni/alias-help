import * as TFU from 'fp-ts/function';
import * as TEI from 'fp-ts/Either';

export const fpMakeArray = (pathArgs: string | string[]): string[] => {
  const arraied = Array.isArray(pathArgs) ? pathArgs : [pathArgs];
  return arraied;
};

export const fpForcePickFirst = (pathArgs: string[]): string | undefined => {
  const [arraied] = pathArgs;
  return arraied;
};

export const fpRemoveGlob = (pathArg: string): string =>
  pathArg.endsWith('/*') ? pathArg.substring(0, pathArg.length - 2) : pathArg;

export const fpRemoveGlobWithForceFirst = (argsFrom: string | string[]): string | undefined =>
  TFU.pipe(argsFrom, fpMakeArray, (args) => args.map((pathElement) => fpRemoveGlob(pathElement)), fpForcePickFirst);

export const fpRemoveGlobForWebpack = (argsFrom: string | string[]): string | string[] | undefined =>
  TFU.pipe(
    argsFrom,
    (args) => (Array.isArray(args) ? TEI.left(args) : TEI.right(args)),
    TEI.foldW(
      TFU.flow(
        (args) => (args.length <= 1 ? TEI.left(args) : TEI.right(args)),
        TEI.foldW(
          TFU.flow(
            (args) => fpForcePickFirst(args),
            (args) => (args === undefined ? TEI.left(args) : TEI.right(args)),
            TEI.foldW(
              (args) => args,
              (args) => fpRemoveGlob(args),
            ),
          ),
          (args) => args.map((pathElement) => fpRemoveGlob(pathElement)),
        ),
      ),
      (args) => fpRemoveGlob(args),
    ),
  );
