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
