#!/usr/bin/env node
const cac = require('cac');

const pkg = require('../package.json');
const cli_name = 'kz-git';
const cli = cac(cli_name);

const { mergeProcess } = require('./utils/merge');
cli
  .command('[target_branch]', 'merge current branch into target_branch')
  .example('amg master    merge current branch into the branch which named "master"')
  .action((targetBranch) => {
    // 如果没有输入参数，则输出帮助信息
    if (targetBranch === undefined) {
      cli.outputHelp();
    } else {
      mergeProcess({ target: targetBranch });
    }
  });

cli.help();
cli.version(pkg.version);

cli.parse();
