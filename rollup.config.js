import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import typescript2 from "rollup-plugin-typescript2";
import { terser } from 'rollup-plugin-terser';

const isProd = (process.env.BUILD === 'production');

const BASE_CONFIG = {
    input: "src/main.ts",
    external: ["obsidian","obsidian-dataview/lib/data-model/value"],
    onwarn: (warning, warn) => {
        // Sorry rollup, but we're using eval...
        if (/Use of eval is strongly discouraged/.test(warning.message)) return;
        warn(warning);
    },
};

const getRollupPlugins = (tsconfig, ...plugins) =>
    [
        typescript2(tsconfig),
        nodeResolve({ browser: true }),
        json(),
        commonjs(),
       terser({
          ecma: 2018,
          mangle: { toplevel: true },
          compress: {
            module: true,
            toplevel: true,
            unsafe_arrows: true,
            drop_console: true,
            drop_debugger: true
          },
          output: { quote_style: 1 }
        }),
    ].concat(plugins);

const PROD_PLUGIN_CONFIG = {
    ...BASE_CONFIG,
    output: {
        dir: 'dist',
        sourcemap: 'inline',
        sourcemapExcludeSources: isProd,
        format: "cjs",
        exports: "default",
        name: "Database Folder (Production)",
    },
    plugins: getRollupPlugins(),
};
let configs = [];
configs.push(PROD_PLUGIN_CONFIG);

export default configs;