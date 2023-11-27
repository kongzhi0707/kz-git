
// 当前的分支 git/commit/push 到远程仓库去
const inquirer = require('inquirer');
const {
  addCode,
  commitCode,
  pushToRemote,
} = require('./git');

async function pushProcess() { 
  // 将工作区的文件添加到暂存区了
  addCode();

  const { result } = await inquirer.prompt([
    {
      type: "input",
      message: "请输入提交的注释",
      name: "result",
      validate(value) {
        if (!value) {
          return '请输入提交的内容';
        }
        return true;
      }
    }
  ])
  if (result) { 
    // 提交代码
    commitCode(result);
  }
  // 推送到远程
  pushToRemote();
}

module.exports = {
  pushProcess,
};