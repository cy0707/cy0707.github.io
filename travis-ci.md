# Travis CI 持续集成服务

<!-- TOC -->

- [Travis CI 持续集成服务](#travis-ci-%e6%8c%81%e7%bb%ad%e9%9b%86%e6%88%90%e6%9c%8d%e5%8a%a1)
  - [什么是持续集成服务](#%e4%bb%80%e4%b9%88%e6%98%af%e6%8c%81%e7%bb%ad%e9%9b%86%e6%88%90%e6%9c%8d%e5%8a%a1)
  - [二、.travis.yml](#%e4%ba%8ctravisyml)
  - [运行流程](#%e8%bf%90%e8%a1%8c%e6%b5%81%e7%a8%8b)
  - [生命周期](#%e7%94%9f%e5%91%bd%e5%91%a8%e6%9c%9f)

<!-- /TOC -->

## 什么是持续集成服务

Travis CI 提供的是持续集成服务（Continuous Integration，简称 CI）。它绑定 Github 上面的项目，只要有新的代码，就会自动抓取。然后，提供一个运行环境，执行测试，完成构建，还能部署到服务器。

持续集成指的是只要代码有变更，就自动运行构建和测试，反馈运行结果。确保符合预期以后，再将新代码"集成"到主干。

持续集成的好处在于，每次代码的小幅变更，就能看到运行结果，从而不断累积小的变更，而不是在开发周期结束时，一下子合并一大块代码。

## 二、.travis.yml

Travis 要求项目的根目录下面，必须有一个.travis.yml文件。这是配置文件，指定了 Travis 的行为。该文件必须保存在 Github 仓库里面，一旦代码仓库有新的 Commit，Travis 就会去找这个文件，执行里面的命令。

这个文件采用 YAML 格式，例如一个Node项目的配置

```
language: node_js
deploy:
  provider: pages
  skip_cleanup: true
  github_token: $GITHUB_TOKEN  # Set in the settings page of your repository, as a secure variable
  keep_history: true
  on:
    branch: master
```

## 运行流程

1. language字段: 指定了默认运行环境
2. install字段：install字段用来指定安装脚本。
3. script字段指定要运行的脚本，script: true表示不执行任何脚本，状态直接设为成功,用来指定构建或测试脚本
4. script阶段结束以后，还可以设置通知步骤（notification）和部署步骤（deployment），它们不是必须的。部署的脚本可以在script阶段执行，也可以使用 Travis 为几十种常见服务提供的快捷部署功能  

## 生命周期

* OPTIONAL Install apt addons
* OPTIONAL Install cache components
* before_install: install 阶段之前执行
* install
* before_script: script 阶段之前执行
* script
* OPTIONAL before_cache (for cleaning up cache)
* after_success or after_failure: 构建成功/构建失败触发
* OPTIONAL before_deploy：部署之前触发
* OPTIONAL deploy
* OPTIONAL after_deploy：部署之后触发
* after_script：script 阶段之后执行
