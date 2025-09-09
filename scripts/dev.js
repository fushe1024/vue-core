import esbuild from 'esbuild'
import minimist from 'minimist' // 新版本采用 nodejs 的 parseArgs 解析命令行参数
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

// 解析命令行参数
const args = minimist(process.argv.slice(2))
const target = args._[0] // 打包的模块
const format = args.f // 输出格式

const require = createRequire(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))

// 入口文件
const entry = resolve(__dirname, `../packages/${target}/src/index.ts`)
const pkg = require(resolve(__dirname, `../packages/${target}/package.json`))

esbuild
  .context({
    entryPoints: [entry],
    outfile: resolve(
      __dirname,
      `../packages/${target}/dist/${target}.${format}.js`
    ),
    bundle: true,
    sourcemap: true, // 生成 sourcemap 文件
    format, // 输出格式
    platform: 'browser', // 浏览器环境
    target: 'es2016', // 目标环境
    globalName: pkg.buildOptions?.name, // 全局变量名
  })
  .then(ctx => {
    ctx.watch()
    console.log('watching...')
  })
