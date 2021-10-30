import path from 'path';
import { Plugin, ResolvedConfig } from 'vite';
import { writeJSON, existsSync, createFileSync } from 'fs-extra';
import chalk from 'chalk';

const name = '@w6s/export-env-json';
const logInfo = (info: string) => console.log(`${chalk.blue(name)}`, chalk.green(info));
const logError = (info: string, err: Error) => console.log(`${chalk.blue(name)}`, chalk.red(info), err);

const getAvailableProperties = (config: ResolvedConfig) => {
  const availableProperties: any = {};

  const envs = config.env;
  const envPrefix = config.envPrefix as string;
  for (let key in envs) {
    if (key.indexOf(envPrefix) === 0) availableProperties[key] = envs[key];
  }

  // 默认带上 BASE_URL
  availableProperties['BASE_URL'] = envs['BASE_URL'];

  return availableProperties;
};

const createOutDirPathIfNotExist = (path: string) => {
  if (!existsSync(path)) {
    createFileSync(path);
  }
};

interface IExportEnvJson {
  /** 输出的文件名，默认为 env.json */
  fileName?: string;
  /** 文件的导出位置，默认跟 Vite 配置的 outDir 属性一致  */
  outDir?: string;
}

/**
 * 导出 env 中的属性到 json 文件
 * 
 * @description 只会导出带 envPrefix 前缀属性的值，默认在 ./dist 中生成 env.json 文件
 * @param {IExportEnvJson} [options]
 * @return {*}  {Plugin}
 */
export const ExportEnvJson = (options?: IExportEnvJson): Plugin => {
  let fileName = options?.fileName || 'env.json';
  if (!/.json$/.test(fileName)) fileName += '.json';

  let outDir: string;
  let config: ResolvedConfig;

  return {
    enforce: 'post',
    apply: 'build',
    name,

    configResolved(resolvedConfig) {
      config = resolvedConfig;
      outDir = options?.outDir || config.build.outDir;
    },

    closeBundle() {
      const output = path.join(config.root, outDir, fileName);

      createOutDirPathIfNotExist(output);
      writeJSON(output, getAvailableProperties(config), (err) => {
        if (err) return logError('Failed to create!', err);
        logInfo(`Successfully created '${fileName}'.`);
        logInfo(`Generated to '${path.relative(config.root, output)}'`);
      })
    }
  };
};

export default {
  ExportEnvJson,
};