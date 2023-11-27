
// 当前的分支 git/commit/push 到远程仓库去

const {
  addCode,
  commitCode,
  pushToRemote,
} = require('./git');

async function pushProcess() { 
  // 将工作区的文件添加到暂存区了
  addCode();
  // 提交代码
  const result = commitCode();

  if (result) { 
    // 推送到远程
    pushToRemote();
  }
  
}

module.exports = {
  pushProcess,
};