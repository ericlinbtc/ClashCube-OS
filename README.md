# ClashCube OS Frontend

ClashCube OS 的前端工程已升级为 Vite + React 的应用结构，保留现有产品界面与交互，同时把后端接入需要的配置、路由和 API 服务层拆出来。后续可以按 feature 逐步把 `src/legacy/bootstrap.js` 中的交互迁移为独立 React 组件。

## 运行

```bash
npm install
npm run dev
```

默认访问：

```text
http://localhost:4175
```

生产构建和本地预览：

```bash
npm run build
npm run preview
```

保留 Node 静态服务和 API 代理：

```bash
npm run build
OPENCLAW_API=http://your-controller:8000 npm run serve
```

## 环境变量

复制 `.env.example` 为 `.env.local` 后可配置：

```text
VITE_API_BASE=/api
VITE_USE_LOCAL_DEMO_DATA=true
VITE_CONTROLLER_PROXY_TARGET=http://192.168.5.190:8000
```

说明：

- `VITE_API_BASE`：前端请求的 API 前缀。
- `VITE_USE_LOCAL_DEMO_DATA`：默认使用本地演示数据；地址栏加 `?controller=1` 可临时连接真实控制器。
- `VITE_CONTROLLER_PROXY_TARGET`：Vite 开发服务器 `/api/*` 的代理目标。
- `OPENCLAW_API`：`server.mjs` 生产静态服务的代理目标。

## 页面路径

```text
/overview       仪表盘
/projects       我的项目
/workflow       工作模版
/skills         行业技能
/knowledge      知识库
/config         节点配置
/subscription   订阅服务
```

## 前端结构

```text
src/
  app/                 应用入口、路由表、运行时桥接
  config/              环境变量和运行配置
  services/            后端 API client 与业务接口封装
  features/            各功能模块的后续 React 迁移边界
  shared/              共享常量、工具、组件和 hooks
  styles/              全局设计系统与布局样式
  legacy/              当前已验证的产品交互实现
  mocks/               后续 mock 数据或 MSW handlers
```

## 后端接入边界

后端开发优先从 `src/services/openclawApi.js` 接口层对齐数据契约。当前已预留：

- `health()`：控制器健康检查。
- `nodes()`：节点列表。
- `workflows(params)`：工作流记录。
- `runWorkflow(payload)`：发起工作流。
- `sendCommand(payload)`：发送指令。
- `createDiscussion(payload)`：发起讨论。
- `registerNode(payload)`：注册节点。

## 当前模块

- 总览：展示节点数量、开放行业、工作流执行次数和 Token 使用。
- 我的项目：展示指令、工作流和讨论的执行记录，支持查看详情。
- 工作模版：管理平台模版和个人模版，支持新建个人模版。
- 行业技能：按行业管理技能开关。
- 知识库：新增资料、行业切换、资料详情查看。
- 节点配置：提交机器 IP、节点名称、用户名、密码和 AI 模型配置。
- 订阅服务：Free、Basic、Pro、Enterprise 四种方案，控制 Token 和开放行业。
