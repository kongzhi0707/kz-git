const inquirer = require('inquirer');

const {
  getCurrentBranchName,
  hasGit,
  pullBranch,
  mergeBranch,
  checkoutBranch,
  pushToRemote,
} = require('./git');

async function mergeProcess({ target = 'dev' }) { 
  hasGit();
  // 获取当前分支名称
  const sourceBranch = getCurrentBranchName();
  // 下拉当前分支的代码
  pullBranch(sourceBranch);
  // 切换到目标分支
  checkoutBranch(target);
  // 如果存在远程分支，则拉取远程分支
  pullBranch(target);
  // 合并代码
  mergeBranch(sourceBranch, target);
  // 询问是否需要推送到远程
  const isPushRemote = await confirm({
    message: "是否要上传到远程分支？",
    default: true,
  });
  if (isPushRemote) { 
    pushToRemote();
  }
  // 询问是否要返回原分支
  const { isBackToSourceBranch } = await inquirer.prompt([{
    message: "是否要返回原来的分支？",
    type: "confirm",
    name: "isBackToSourceBranch",
    default: true,
  }]);
  if (isBackToSourceBranch) { 
    checkoutBranch(sourceBranch);
  }
}

module.exports = {
  mergeProcess,
};