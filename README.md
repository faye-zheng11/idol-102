# Idol 102 Live Prototype

本地可跑的实时对话原型。API key 不写入前端，必须通过环境变量传给本地代理。

## 启动

```bash
cd /Users/apple/Documents/Codex/2026-05-09-https-chatgpt-com-share-69ff0077-6c4c/idol-102-live
export OPENAI_API_KEY="你的 key"
npm start
```

然后打开：

```bash
open http://localhost:8787
```

## 流程

1. Splash
2. 选 Stray Kids 成员
3. 幻境过渡背景介绍
4. 后台点选式对话，3-5 次点击走完
5. 梦醒过渡
6. 真实世界：JYP 楼下 scene
7. 8-10 轮内收束到角色主动添加联系方式
8. 系统提示已添加联系人
9. 跳转 Chat，角色第一句：“对了，刚刚忘了问你叫什么了。”
10. 用户自由对话，L1 用户名字/事实进入前端 Portrait 状态

## 安全说明

不要把 API key 放进 `index.html` 或 `app.js`。前端代码任何用户都能看到。
