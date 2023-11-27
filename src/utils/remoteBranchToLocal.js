// 远程的分支拉取到本地

const inquirer = require('inquirer');

const { 
  remoteBranch, // 把远程的分支拉取到本地
  localCreateBranch, // 在本地创建分支 并且切换到该分支
  remoteBranchToLocal, // 把远程分支拉取到本地
} = require('./git');

async function remoteBranchLocal() {
  const { result } = await inquirer.prompt([
    {
      type: "input",
      message: "请输入远程分支的名称",
      name: "result",
      validate(value) {
        if (!value) {
          return '请输入远程分支的名称';
        }
        return true;
      }
    }
  ])
  if (result) { 
    remoteBranch(result);
    localCreateBranch(result);
    remoteBranchToLocal(result);
  }
}

module.exports = {
  remoteBranchLocal,
};