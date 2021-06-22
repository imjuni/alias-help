import path from 'path';
import typescript from 'typescript';

export function readTsconfig(tsconfigPath: string): ReturnType<typeof typescript.parseJsonConfigFileContent> {
  const parseConfigHost: typescript.ParseConfigHost = {
    fileExists: typescript.sys.fileExists,
    readFile: typescript.sys.readFile,
    readDirectory: typescript.sys.readDirectory,
    useCaseSensitiveFileNames: true,
  };

  const configFile = typescript.readConfigFile(tsconfigPath, typescript.sys.readFile);

  const tsconfig = typescript.parseJsonConfigFileContent(
    configFile.config,
    parseConfigHost,
    path.dirname(tsconfigPath),
  );

  return tsconfig;
}
