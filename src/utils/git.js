
const shell = require('shelljs');
const chalk = require('chalk'); // console 变颜色

// 命令运行结果输出到终端
shell.config.silent = false;
// 设置shell执行命令报错时不抛出异常
shell.config.fatal = false;

function handleError(err) { 
  console.log(chalk.red(err));
  // 退出当前进程
  shell.exit(-1);
}

function hasGit() { 
  if (!shell.which('git')) { 
    handleError('Sorry, the script requires git');
  }
}

// 在当前分支下 add 代码
function addCode() { 
  const { code, stderr } = shell.exec(`git add .`);
  if (code !== 0) { 
    handleError(stderr);
    return;
  }
  console.log(chalk.green(`git add 已成功将工作区的文件添加到暂存区了`));
}

// 将暂存区内容提交到版本库
function commitCode(result) { 
  const { code, stderr } = shell.exec(`git commit -m ${result}`);
  if (code !== 0) {
    handleError(stderr);
    return;
  }
  console.log(chalk.green(`git commit 提交成功`));
}

// 把远程的分支拉取到本地
function remoteBranch(branchName) { 
  const { code, stderr } = shell.exec(`git fetch origin ${branchName}`);
  if (code !== 0) {
    handleError(stderr);
    return;
  }
  console.log(chalk.green(`已成功将远程分支拉取到本地`));
}

// 在本地创建分支 并且切换到该分支
function localCreateBranch(branchName) { 
  const { code, stderr } = shell.exec(`git checkout -b ${branchName} origin/${branchName}`);
  if (code !== 0) {
    handleError(stderr);
    return;
  }
  console.log(chalk.green(`已成功在本地创建分支且切换到该分支上`));
}
// 把远程分支拉取到本地
function remoteBranchToLocal(branchName) { 
  const { code, stderr } = shell.exec(`git pull origin ${branchName}`);
  if (code !== 0) {
    handleError(stderr);
    return;
  }
  console.log(chalk.green(`远程的分支已拉取到本地了`));
}


// 获取当前的分支名
function getCurrentBranchName() { 
  const { stdout, code, stderr } = shell.exec('git symbolic-ref --short -q HEAD', { slient: true, });
  if (code !== 0) { 
    handleError(stderr);
  }
  const currentBranch = stdout.trim();
  console.log(`当前的分支是: ${currentBranch}`);
  return currentBranch;
}

// 拉取分支
function pullBranch(targetBranch) { 
  // 列出当前仓库中已配置的远程仓库
  const { stdout, code, stderr } = shell.exec('git remote', {
    silent: true,
  });
  if (code !== 0) { 
    handleError(stderr);
    return;
  }
  if (!stdout) {
    return;
  }
  // 执行 git pull
  console.log(`下拉${targetBranch}分支的代码...`);
  let {
    stdout: stdout1,
    code: code1,
    stderr: stderr1
  } = shell.exec('git pull', {
    silent: true,
  });
  if (code1 !== 0) { 
    console.log(chalk.red('下拉分支遇到问题'));
    return;
  }
  console.log(chalk.green('下拉完成'));
}

// 切换分支
function checkoutBranch(branch) { 
  const { code, stderr } = shell.exec(`git checkout ${branch}`);
  if (code !== 0) { 
    handleError(stderr);
    return;
  }
  console.log(chalk.green(`已切到分支: ${branch}`));
}

// 合并分支
function mergeBranch(sourceBranch, targetBranch) { 
  console.log(`开始把${sourceBranch}合并到${targetBranch}...`);
  const { code } = shell.exec(`git merge ${sourceBranch}`);
  if (code !== 0) { 
    console.log(chalk.red('合并存在问题, 请手动处理'));
    shell.exit(-1);
  }
  console.log(chalk.green('合并分支完成'));
}

// 推送当前分支到远程仓库
function pushToRemote() { 
  console.log('准备推送到远程仓库...');
  const { code } = shell.exec('git push');
  if (code !== 0) { 
    console.log(chalk.red('推送出现问题'));
    shell.exec(-1);
  }
  console.log(chalk.green('推送远程分支成功'));
}

module.exports = { 
  addCode, // 已成功将工作区的文件添加到暂存区了
  commitCode, // 将暂存区内容提交到版本库
  hasGit,
  getCurrentBranchName, // 获取当前分支名称
  pullBranch, // 拉取分支
  checkoutBranch, // 切换分支
  mergeBranch, // 合并分支
  pushToRemote, // 推送到远程
  remoteBranch, // 把远程的分支拉取到本地
  localCreateBranch, // 在本地创建分支 并且切换到该分支
  remoteBranchToLocal, // 把远程分支拉取到本地
}