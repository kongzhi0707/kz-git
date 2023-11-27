#!/usr/bin/env node
const { program } = require('commander');

// 引入package.json
const PKG = require('../package.json');

const { mergeProcess } = require('./utils/merge');

program.version(PKG.version); // 设置版本默认命令 -V --version

program.command('[target_branch]').description('merge current branch into target_branch').action(targetBranch => {
  // 如果没有输入参数
  if (targetBranch) {
    mergeProcess({ target: targetBranch });
  }
});

program.parse(process.argv);
