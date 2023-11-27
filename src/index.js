#!/usr/bin/env node
const { program } = require('commander');
const cac = require('cac');

const pkg = require('../package.json');
const cli = cac(pkg.name);

const { mergeProcess } = require('./utils/merge');
const { pushProcess } = require('./utils/currentPush');
cli
  .command('[target_branch]', 'merge current branch into target_branch')
  .example('kz-git master    merge current branch into the branch which named "master"')
  .action((targetBranch) => {
    // 如果没有输入参数，则输出帮助信息
    if (targetBranch === undefined) {
      cli.outputHelp();
    } else {
      mergeProcess({ target: targetBranch });
    }
  });

cli.command('push', '将当前分支的代码push到远程仓库去')
  .action(async () => {
    await pushProcess()
  });

cli.help();
cli.version(pkg.version);

cli.parse();
