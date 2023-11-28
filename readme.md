### kz-git 命令行工具

kz-git 运行有如下几个命令：

<img src="https://raw.githubusercontent.com/kongzhi0707/kz-git/master/images/1.png" /> <br />

#### 1）kz-git push 命令

该命令是把当前分支的代码 push 到远程仓库去。该命令主要执行三个操作。

```
git add .
git commit -m '自己编写的注释'
git push
```

因此我们执行执行一个命令即可完成操作。

#### 2）[target_branch]命令：合并当前的分支代码到目标分支上。

应用场景是：在功能分支开发代码时，开发完成后，需要将代码合并到测试分支去。然后将代码推送到远程去。最后切换回来我们的功能分支上。实现的步骤如下:

1. git checkout 切换到测试分支上。
2. git merge 合并我们刚修复的功能分支。
3. git push 推送到远程。
4. git checkout 切换功能分支，继续开发修复 bug。

如果在调试过程中。发现还有 bug。我们要重复上面的过程。因此我们可以写个命令行工具。我们只需要执行一个命令就可以把上面的四个步骤的命令都执行一次。我们可以来演示下：

我们有两个分支，一个是 daily/0.0.1, 一个是 main 分支，现在我们在 daily/0.0.1 分支上修改完代码后。我们可以先执行 kz-git push，这个是第二个命令。

<img src="https://raw.githubusercontent.com/kongzhi0707/kz-git/master/images/2.png" /> <br />

如上我们可以看到，本地有两个分支 daily/0.0.1 和 main 分支，我在 daily/0.0.1 分支上修改了下代码， 然后执行命令 kz-git push 后就会把代码提交到远程仓库去，在提交之前需要自己编写一些注释。我上面注释为 "测试代码"；

我们回到 github 上查看下就可以看到，确实推送到新代码到远程仓库去了。如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/kz-git/master/images/3.png" /> <br />

现在我们再执行 kz-git main 命令。如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/kz-git/master/images/4.png" /> <br />

如上我们可以看到，我们当前的分支是 daily/0.0.1 上。比如我们修改完成代码后。我们可以先使用 kz-git push 推送到远程仓库去，然后使用 命令 kz-git main 命令。把当前分支的代码合并带 main 分支上。它一共做了如下几个步骤:

```
1) 下拉 daily/0.0.1 分支最新代码。
2）切换到main分支上。下拉main分支的最新代码。
3）把 daily/0.0.1分支上的代码 合并 到 main 分支上。如果合并过程中产生冲突，我们需要手动解决下冲突。重新操作。
4）当合并完成后，会询问: 是否 mian 分支上的代码推送到远程仓库中。如果我们选择 Y，就是推送到远程库中。我们选择 N , 就是不推送到远程库中。
5）然后会继续询问我们是否切换回原来的 daily/0.0.1 分支上。如果选择 Y，就是回到 daily/0.0.1分支上。如果选择 N，就是还在 main 分支上。
```

使用方法：

我们重新说一遍，比如我们在 daily/0.0.1 分支上修改了代码完成后，我们先执行命令 kz-git push，把当前分支代码提交到远程仓库去。然后我们再使用 kz-git main 命令。把 daily/0.0.1 分支的代码合并到 main 分支上。kz-git main 命令做了如下事情：

```
1）在当前的daily/0.0.1分支上执行了 git pull.
2) 获取当前分支的名称。
3）切换到目标分支 main。
4）在目标分支上 main 执行 git pull.
5) 在main分支上合并 daily/0.0.1 分支的代码。
6）询问是否要推送到远程仓库中。
7）询问是否要切回源分支。
```

#### 3）kz-git fetch 命令。

该命令的作用是：拉取远程分支到本地。比如我们选择在 main 分支上，我们把 daily/0.0.1 分支先删除掉。我们现在可以看到 远程分支有 main 和 daily/0.0.1. 如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/kz-git/master/images/5.png" /> <br />

然后我们再执行 kz-git fetch 命令，就会将远程分支 daily/0.0.1 下载到本地的 daily/0.0.1 分支上。如下所示:

<img src="https://raw.githubusercontent.com/kongzhi0707/kz-git/master/images/6.png" /> <br />

我们需要输入远程分支的名称就会下载。然后会切换到 daily/0.0.1 分支上。该命令主要做了如下三步操作:

```
1) 请输入远程分支的名称. 比如 daily/0.0.1
2) 把远程的分支拉取到本地. 执行命令 git fetch origin daily/0.0.1
3) 在本地创建分支 并且切换到该分支. 执行命令: git checkout -b daily/0.0.1 origin/daily/0.0.1
4) 把远程分支拉取到本地. 执行命令: git pull origin daily/0.0.1
```

代码目录结构如下:

```
|--- src
| |--- utils
| | |--- currentPush.js
| | |--- git.js
| | |--- merge.js
| | |--- remoteBranchToLocal.js
| |--- index.js
| |--- package.json
```

src/index.js 入口文件的代码如下：

```
#!/usr/bin/env node
const { program } = require('commander');
const cac = require('cac');

const pkg = require('../package.json');
const cli = cac(pkg.name);

const { mergeProcess } = require('./utils/merge');
const { pushProcess } = require('./utils/currentPush');
const { remoteBranchLocal } = require('./utils/remoteBranchToLocal')

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
```

#### src/utils/currentPush.js 代码，是把当前分支代码推送到远程仓库去。如下代码：

```
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
```

#### src/utils/remoteBranchToLocal.js 远程的分支拉取到本地

```
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
```

#### src/utils/merge.js 是合并分支的代码。

```
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
  const { isPushRemote } = await inquirer.prompt([{
    message: "是否要上传到远程分支？",
    type: "confirm",
    name: "isPushRemote",
    default: true,
  }]);
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
```

#### src/utils/git.js

所有 git 操作命令在该文件中。代码如下：

```
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
```
