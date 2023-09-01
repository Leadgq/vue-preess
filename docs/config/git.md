# git

```
 记录目前自己学到的一些git命令
```

## 查看日志

```
    git log
```

## 查看当前分支

```
    git branch
```

## 提交本地

```
    git add .
    git commit -m "message"
```

## 修改远端

```
    git push origin dev
```

## 查看所有分支

```
    git branch -a
```

## 切换分支

```
    git checkout 分支名
```

## 创建本地分支

```
    git branch 分支名
```

## 删除本地分支

```
    git branch -d 分支名
```

## 删除远端分支

```
   git push origin --delete   分支名
```

## 创建远端分支

```
    git branch  dev   //创建本地分支
    git push origin dev   //将本地分支推送到远端
    git branch  --set-upstream-to=origin/dev  //将本地分支与远端分支关联
    git branch  -a //查看所有分支
```

## 删除远端分支

```
    git push origin --delete dev
```

## 缓存修改

```
    git stash save "message"
```

## 查看缓存

```
    git stash list
```

## 恢复缓存

```
    git stash apply stash@{0} 这里是标号
    git stash pop stash@{0}
```

## 删除缓存

```
    git stash drop stash@{0}
```

## 清空缓存

```
    git stash clear
```

## cherry-pick

```
    git cherry-pick [<options>] <commit-ish>...
        常用options:
        --quit                退出当前的chery-pick序列
        --continue            继续当前的chery-pick序列
        --abort               取消当前的chery-pick序列，恢复当前分支
        -n, --no-commit       不自动提交
        -e, --edit            编辑提交信息
        
    git cherry-pick  -n  <commitHash> pick 一个
    git cherry-pick  -n  commitHash^..commitHash  pick 多个包含左侧
    git cherry-pick  -n  commitHash..commitHash   pick 多个不包含左侧
```