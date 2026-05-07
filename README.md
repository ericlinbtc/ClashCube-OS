# OpenClaw SaaS Console

根据 `/Users/mengjunlin/Downloads/SaaS系统产品.docx` 重构的 SaaS 产品台。页面采用黑色底色和亮绿色高亮，功能范围包含总览、工作流、技能、项目、配置和订阅六个主模块。

## 运行

```bash
node server.mjs
```

打开：

```text
http://localhost:4175
```

各功能模块支持独立访问路径：

```text
/overview       仪表盘
/workflow       工作模版
/skills         行业技能
/projects       我的项目
/knowledge      知识库
/config         节点配置
/subscription   订阅服务
```

本地服务会把 `/api/*` 代理到默认控制器：

```text
http://192.168.5.190:8000
```

如需切换后端：

```bash
OPENCLAW_API=http://your-controller:8000 PORT=4175 node server.mjs
```

## 当前模块

- 总览：展示节点数量、开放行业、工作流执行次数和 Token 使用，节点卡片展示机器 IP、节点名称、AI 模型、运行时长和暂停/启动状态。
- 工作流：集中管理全行业工作流模版和个人模版；右侧操作区提供指令、工作流、讨论三类对话框。
- 技能：按行业管理可用技能，支持查看技能总数、开启数量、关闭数量，并可切换单项技能状态。
- 项目：展示指令、工作流和讨论的执行记录，支持查看详情、复用和输出结果。
- 配置：提交机器 IP、节点名称、用户名、密码和 AI 模型配置。
- 订阅：Free、Basic、Pro、Enterprise 四种方案，控制 Token 和开放行业。

## 文件

- `index.html`：产品台结构。
- `styles.css`：黑色 + 亮绿色视觉系统与响应式布局。
- `app.js`：订阅、节点、工作流、模板、项目和配置交互。
- `server.mjs`：静态资源服务与 API 代理。
