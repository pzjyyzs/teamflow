# TeamFlow

一个用于练习“产品化低代码/管理平台”核心能力的全栈项目（前后端同仓库）。

目标：
- 用 Vue 3 在前端实现路由、状态管理、动画、权限控制等常见后台能力
- 用 Hono + Node + MongoDB(Mongoose) 在后端实现鉴权、RBAC、CRUD、审计日志
- 为后续“产品版 + 实施项目交付（按客户需求扩展）”预留可扩展结构

## Repo 结构
- `apps/web`：前端（Vue 3 + Vite）
- `apps/api`：后端（Hono + Node + Mongoose）
- `packages/shared`：前后端共享（类型、权限常量、schema）
- `infra`：基础设施（MongoDB 的 docker-compose）

## 本地启动（开发）

### 1) 启动 MongoDB
在仓库根目录执行：
```bash
docker compose --env-file infra/.env -f infra/docker-compose.yml up -d
```

查看容器状态：
```bash
docker compose --env-file infra/.env -f infra/docker-compose.yml ps
```

### 2) 配置并启动 API
复制环境变量：
```bash
cp apps/api/.env.example apps/api/.env
```

启动 API：
```bash
pnpm --filter @teamflow/api dev
```

健康检查：
```bash
curl http://localhost:8787/health
```

### 3) 启动 Web
```bash
pnpm --filter web dev
```

## Todo List（路线图）

### Milestone 0：工程化与环境
- [ ] 统一 `.env` 规范（`infra/.env.example`、`apps/api/.env.example`、`apps/web/.env.example`）
- [ ] 根目录增加 `pnpm` 脚本：一键启动 `mongo + api + web`
- [ ] 增加基础 Lint/Format（仅限 web/api，不强行全仓）

### Milestone 1：鉴权（API + Web）
- [ ] API：`POST /auth/register`、`POST /auth/login`、`POST /auth/refresh`
- [ ] API：`GET /me`（返回用户信息 + permissions）
- [ ] Web：登录页对接 API（替换 demo 登录）
- [ ] Web：路由守卫（未登录跳转、登录后回跳）

### Milestone 2：RBAC（角色/权限/菜单）
- [ ] shared：权限常量与类型（`Permission`）
- [ ] API：`roles`、`users` 数据模型与管理接口
- [ ] API：`permit()` 中间件（接口权限）
- [ ] Web：动态菜单（根据 permissions 生成）
- [ ] Web：按钮级权限指令（如 `v-permission`）

### Milestone 3：通用 CRUD（可复用）
- [ ] Web：通用表格组件（分页/排序/筛选/列配置）
- [ ] Web：通用表单组件（校验/联动/异步选项）
- [ ] API：通用分页查询规范（`page/pageSize/sort/filter`）

### Milestone 4：业务模块（请求/审批流）
- [ ] 模型：`Request`（如工单/报销/请假统一承载）
- [ ] 流程：状态机 + 审批记录（history）
- [ ] 附件：上传/下载（先本地，后续可换 S3）
- [ ] 审计：`AuditLog`（谁在什么时候改了什么）

### Milestone 5：动画与体验（Vue3 特性强化）
- [ ] 页面转场（`Transition`）、列表动效（`TransitionGroup`）
- [ ] Skeleton/Loading/Error 的统一处理
- [ ] keep-alive + 缓存策略（列表页性能）

### Milestone 6：产品化与实施扩展
- [ ] 多租户隔离（tenantId 全链路）
- [ ] 模块化扩展点（自定义字段/自定义页面/自定义组件）
- [ ] 版本与发布策略（产品版本 vs 项目版本）
