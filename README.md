# vite-plugin-export-env-json

🚕 After building, automatically export the json file of the client-side available properties in .env

[![npm version](https://badge.fury.io/js/@w6s%2Fexport-env-json.svg)](https://badge.fury.io/js/@w6s%2Fexport-env-json) [![Test](https://github.com/WorkPlusFE/vite-plugin-export-env-json/actions/workflows/test.yml/badge.svg)](https://github.com/WorkPlusFE/vite-plugin-export-env-json/actions/workflows/test.yml)

## 目的

[我司](https://workplus.io)前端项目开发目前在部署上存在以下问题：

* 同一份代码需要给多个客户部署体验，而访问地址不一样可能需要重复打包；
* 自动化构建等基础设施不健全，运维不信任 CI/CD 工具。

经过部门内小伙伴的讨论，最终采取导出环境变量的方式来解放运维的生产力。

在前端代码中使用到的环境变量（满足 `vite envPrefix`条件的），全部导出到指定文件，并且加以文档描述各字段用途；接着前端需要通过 AJAX 的方式，请求到该配置文件并使用。

```ts
import axios from 'axios';

// 要注意触发的时机
export default (): Promise<string> => {
  if (process.env.NODE_ENV === 'production') {
    return new Promise((resolve) => {
      axios.get('env.json').then(({ data }) => {
        resolve(data.W6S_BASE_API);
      });
    });
  }
  return new Promise((resolve) => {
    resolve(process.env.W6S_BASE_API as string);
  });
};
```

> 把环境变量输出到`index.html`也是一种方式，只是没有比修改一个名义上的配置文件更加贴切。

## 安装

> 需要 Vite@2+ 版本。

```bash
yarn add @w6s/export-env-json -D

# npm
npm install --save-dev @w6s/export-env-json
```

## 使用

```js
// vite.config.ts/.js
import { ExportEnvJson } from '@w6s/export-env-json';

export default defineConfig({
  plugins: [
    vue(),

    // 该插件只会在 build 阶段的最后执行
    ExportEnvJson({
      fileName: 'env.json',
      outDir: 'dist'
    })
  ],
})
```

**参数说明：**

* `fileName`：非必需，默认为 env.json；
* `outDir`：非必需，默认为 dist 目录，会跟 Vite 的 build.outDir 保持一致。

> 导出的配置只会是 JSON 文件。


## License

MIT.