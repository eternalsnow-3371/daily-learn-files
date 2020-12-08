"use strict";

import clear from 'rollup-plugin-clear';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import screeps from 'rollup-plugin-screeps';

let cfg;
const dest = process.env.DEST;
if (!dest) {
  console.log("No destination specified - code will be compiled but not uploaded");
} else {
  try {
    cfg = require("./conf/account.json")[dest];
  } catch (err) {
    throw new Error("ERROR! Can not find conf/account.json, create it after conf/account.example.json!");
  }
  if (cfg == null) {
    throw new Error("Invalid upload destination");
  }
}

export default {
  input: "src/main.ts",

  output: {
    file: "dist/main.js",
    format: "cjs",
    sourcemap: false
  },

  plugins: [
    clear({ targets: ["dist", "tsc-out"] }),
    resolve(),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.json" }),
    screeps({ config: cfg, dryRun: cfg == null })
  ]
}
