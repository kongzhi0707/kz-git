#!/usr/bin/env node
const { program } = require('commander');
const cac = require('cac');

const pkg = require('../package.json');
const cli = cac(pkg.name);

const { mergeProcess } = require('./utils/merge');
const { pushProcess } = require('./utils/currentPush');
const { remoteBranchLocal } = require('./utils/remoteBranchToLocal');

cli
  .command('[target_branch]', '合并当前的分支代码到目标分支上')
  .example('kz-git master    merge current branch into the branch which named "master"')
  .action((targetBranch) => {
    // 如果没有输入参数，则输出帮助信息
    if (targetBranch === undefined) {
      cli.outputHelp();
    } else {
      mergeProcess({ target: targetBranch });
    }
  });

cli
  .command('push', '将当前分支的代码push到远程仓库去')
  .action(async () => {
    await pushProcess()
});

cli
  .command('fetch', '拉取远程分支到本地')
  .action(async () => {
    await remoteBranchLocal();
});

cli.help();
cli.version(pkg.version);

cli.parse();
