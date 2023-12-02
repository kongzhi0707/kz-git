
const shell = require('shelljs');
const chalk = require('chalk'); // console 变颜色
const inquirer = require('inquirer');

// 命令运行结果输出到终端
shell.config.silent = false;
// 设置shell执行命令报错时不抛出异常
shell.config.fatal = false;

// 查看 global 配置
function showGlobal() { 
  const { code } = shell.exec('git config --global --list');
  if (code !== 0) { 
    console.log(chalk.red('查看配置出问题了'));
    shell.exec(-1);
    return;
  }
  console.log(chalk.green('如下global配置成功如上...'));
}

// 全局配置 global
async function globalConfig() { 
  const { name, email } = await inquirer.prompt([
    {
      type: "input",
      message: "请输入你的名字",
      name: "name",
      validate(value) {
        if (!value) {
          return '请输入你的名字';
        }
        return true;
      }
    },
    {
      type: "input",
      message: "请输入你的邮箱",
      name: "email",
      validate(value) {
        if (!value) {
          return '请输入你的邮箱';
        }
        return true;
      }
    }
  ]);
  if (name) { 
    shell.exec(`git config --global user.name ${name}`);
  }
  if (email) { 
    shell.exec(`git config --global user.email ${email}`);
  }
}

module.exports = {
  showGlobal, // 查看global配置
  globalConfig, // 全局配置
}