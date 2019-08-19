# Travis CI 持续集成服务

<!-- TOC -->

- [Travis CI 持续集成服务](#travis-ci-%e6%8c%81%e7%bb%ad%e9%9b%86%e6%88%90%e6%9c%8d%e5%8a%a1)
  - [什么是持续集成服务](#%e4%bb%80%e4%b9%88%e6%98%af%e6%8c%81%e7%bb%ad%e9%9b%86%e6%88%90%e6%9c%8d%e5%8a%a1)
  - [二、.travis.yml](#%e4%ba%8ctravisyml)
  - [运行流程](#%e8%bf%90%e8%a1%8c%e6%b5%81%e7%a8%8b)
  - [生命周期](#%e7%94%9f%e5%91%bd%e5%91%a8%e6%9c%9f)
  - [自动部署到远程服务器](#%e8%87%aa%e5%8a%a8%e9%83%a8%e7%bd%b2%e5%88%b0%e8%bf%9c%e7%a8%8b%e6%9c%8d%e5%8a%a1%e5%99%a8)

<!-- /TOC -->

## 什么是持续集成服务

Travis CI 提供的是持续集成服务（Continuous Integration，简称 CI）。它绑定 Github 上面的项目，只要有新的代码，就会自动抓取。
然后，提供一个运行环境，执行测试，完成构建，还能部署到服务器。

持续集成指的是只要代码有变更，就自动运行构建和测试，反馈运行结果。确保符合预期以后，再将新代码"集成"到主干。

持续集成的好处在于，每次代码的小幅变更，就能看到运行结果，从而不断累积小的变更，而不是在开发周期结束时，一下子合并一大块代码。

## 二、.travis.yml

Travis 要求项目的根目录下面，必须有一个.travis.yml文件。这是配置文件，指定了 Travis 的行为。该文件必须保存在 Github 仓库里面，
一旦代码仓库有新的 Commit，Travis 就会去找这个文件，执行里面的命令。

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
4. script阶段结束以后，还可以设置通知步骤（notification）和部署步骤（deployment），它们不是必须的。部署的脚本可以在script阶段执行，
也可以使用 Travis 为几十种常见服务提供的快捷部署功能  

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

## 自动部署到远程服务器

现在已经可以自动构建了，那么接下来的一步就是部署到远程服务器。Travis 提供 after_success 来实现这步骤。
等等，我们要部署到远程服务器，那么势必需要让 Travis 登录到远程服务，那么登录密码怎么处理才能保证安全？
这是首先要解决的问题，明文肯定是不行的。

git-push---触发Travis---构建完成触发deploy----自动推送到我们部署服务器

通过配合Travis的使用，我们可以实现如下的效果：

测试部署：每次push代码到dev分支，Travis会自动进行单元测试，然后自动的通过SSH将代码部署到对应的开发机器上并重启服务，
以保持开发机上始终是最新的版本。
正式部署：决定上线的时候可以将代码push代码到deploy分支上，Travis会自动将代码部署到正式的开发环境。

要完成自动部署，首先Travis要能监听Github的变化，然后Travis还需要有权限登录到我们的SSH服务器进行部署：

1.配置Travis，让Travis能监听Git的某个分支。
2.Git某个分支提交之后，Travis能自动发现提交并进行编译。
3.Travis将编译后的产物通过SSH部署到给我们指定的机器。

通常我们是通过ssh命令加上用户名和密码访问服务器的，虽然理论上我们也可以在travis的命令中写上诸如
ssh mofei@zhuwenlong.com -p abc的脚本，但是这样的代码如果提交到了公开的仓库中会有很大的泄露服务器密码的风险，
所以我们需要一个别人无法窃取密码或者密钥的方式让Travis登录我们的服务器。

通常的免密登录是基于SSH信任关系的，那么如果我们能把密钥以加密的形式保持在Travis的服务器中，
Travis就能登录我们的服务器了。这里我们可以使用Travis的文件加密功能，把我们的密钥进行加密保存。
在这个过程中，我们的密钥首先会被被Travis加密，解密的密钥被存储在Travis中，就是说只有Travis可以进行解密。
所以我们可以大胆的把这个加密后的文件上传到github中，不用担心其他人盗用我们的密钥。

既然我们想要使用Travis加密文件，第一件事情就是在本地安装Travis。