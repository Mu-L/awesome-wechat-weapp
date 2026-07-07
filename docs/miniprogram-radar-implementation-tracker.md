# 小程序雷达实施追踪表

本文档用于持续追踪“小程序雷达”的实施进度、问题、风险和验证证据。每次推进代码、文档、部署或外部服务配置后，都应更新对应条目，避免只依赖聊天记录判断项目状态。

更新时间：2026-07-07

## 1. 当前结论

当前仓库已经具备本地 MVP 骨架：Next.js 产品页面、资源 API、规则型 AI 兜底、Doctor、Weekly、Admin、Cron 入口、Drizzle schema、Vercel 配置和验证脚本均已落地。本地校验与生产构建已通过。

尚未完成的关键事项是外部生产环境：Vercel Production URL、线上 Postgres、Cron Secret、Admin Token、GitHub Token、Upstash Redis、Vercel Blob 和可选 OpenAI Key 还需要在真实环境配置并验证。

## 2. 进度总览

| 阶段 | 状态 | 当前证据 | 下一步 |
| --- | --- | --- | --- |
| P0 文档收敛 | 已完成 | 核心文档入口已收敛到产品方案、实施总方案、Vercel 生产方案和本追踪表；重复方案文档已删除；`npm run generate:check`、`npm run mvp-check:test` 和 `npm run deploy:check` 通过 | 后续只维护四份核心文档 |
| P1 本地 MVP | 已完成 | `npm run check`、`npm run build` 通过 | 保持每次关键变更后复跑 |
| P2 Vercel 静态部署 | 未开始 | 尚无 Production URL | 在 Vercel 导入 GitHub 仓库并部署 |
| P3 Postgres 主库 | 未开始 | `DATABASE_URL` 未配置 | 选择 Neon 或 Supabase，执行迁移和导入 |
| P4 采集与评分 Cron | 待生产配置 | Cron 代码和鉴权测试已具备 | 配置 `CRON_SECRET` 和 `GITHUB_TOKEN`，做 dry-run |
| P5 Redis 缓存/限流/任务锁 | 待生产配置 | 本地测试覆盖降级、锁冲突和失败兜底 | 创建 Upstash Redis 并验证 |
| P6 Blob 报告和快照 | 待生产配置 | 代码支持上传和 fallback | 创建 Vercel Blob，执行写入/删除探针 |
| P7 Admin 运维闭环 | 待生产配置 | Admin API 和 readiness 已实现，Admin 端点目录已包含 `/api/admin/readiness`，需 `ADMIN_TOKEN` | 配置 `ADMIN_TOKEN` 并验证授权读取 |
| P8 真实 AI | 暂缓 | 规则型 AI 可用，输出校验已覆盖 | 用户确认后再配置 `OPENAI_API_KEY` |
| P9 上线观察 | 未开始 | 尚无生产流量 | 生产部署后观察 7 天 |

状态定义：

- `未开始`：尚未配置或实施。
- `进行中`：已开始但仍有明确未完成项。
- `待生产配置`：代码和本地测试已具备，缺真实外部服务。
- `已完成`：有当前证据证明完成。
- `暂缓`：有意不做，等待明确触发条件。

## 3. 当前问题清单

| ID | 问题 | 影响 | 状态 | 处理方案 |
| --- | --- | --- | --- | --- |
| I-001 | 尚无 Vercel Production URL | 无法完成线上验收 | 打开 | 创建 Vercel 项目后记录 URL |
| I-002 | `DATABASE_URL` 未配置 | 线上只能使用静态 JSON 降级 | 打开 | 默认优先 Neon Postgres；需要 Auth 时选 Supabase |
| I-003 | `CRON_SECRET` 未配置 | 生产 Cron 不能授权运行 | 打开 | 在 Vercel 环境变量配置后执行 dry-run |
| I-004 | `ADMIN_TOKEN` 未配置 | Admin readiness 只能验证未授权保护 | 打开 | 配置后执行授权 readiness 验证 |
| I-005 | `GITHUB_TOKEN` 未配置 | GitHub 采集额度低 | 打开 | 配置只读 token 或降低采集频率 |
| I-006 | Redis 未配置 | 生产环境缺分布式限流和任务锁 | 打开 | 接入 Upstash Redis |
| I-007 | Blob 未配置 | 周报、Doctor 报告和导出快照不能归档 | 打开 | 接入 Vercel Blob |
| I-008 | 真实 AI 未启用 | Advisor、摘要、周报、Doctor 只能使用规则兜底 | 暂缓 | 用户确认后再配置 `OPENAI_API_KEY` |

## 4. 风险清单

| ID | 风险 | 触发信号 | 应对 |
| --- | --- | --- | --- |
| R-001 | 免费额度不够 | Functions、Redis 命令数、Blob 操作数或数据库容量接近上限 | 限流、缓存、日志保留期、Blob 存大文本 |
| R-002 | AI 编造结论 | 输出引用不存在资源或 URL | 证据校验失败不持久化，回退规则结果 |
| R-003 | Cron 超时或重叠 | 采集任务失败、409 锁冲突频繁 | 分批采集、任务锁、降低频率 |
| R-004 | 密钥泄漏 | public、客户端 bundle 或日志出现 secret 名称和值 | 只在服务端读取，跑 `secret-exposure:test` |
| R-005 | 文档再次分叉 | 多份方案给出不同执行顺序 | 只维护四份核心文档，变更后更新索引 |

## 5. 验证记录

| 日期 | 范围 | 命令/证据 | 结果 | 备注 |
| --- | --- | --- | --- | --- |
| 2026-07-07 | 本地完整检查 | `npm run check` | 通过 | 外部服务缺失只产生 warning |
| 2026-07-07 | Next.js 生产构建 | `npm run build` | 通过 | 258 个静态页面生成成功 |
| 2026-07-07 | 文档生成校验 | `npm run generate:check` | 通过 | README 与生成脚本一致 |
| 2026-07-07 | MVP 文档检查 | `npm run mvp-check:test` | 通过 | 实施状态检查已切到实施总方案和追踪表 |
| 2026-07-07 | 文档结构检查 | `npm run deploy:check` | 通过 | 已自动检查核心文档、重复方案文档、索引链接和追踪表结构 |
| 2026-07-07 | Admin 端点目录检查 | `npm run deploy:check` | 通过 | 已自动检查 Admin 页面包含 readiness 和维护 API |
| 2026-07-07 | 实施追踪 CLI | `npm run tracker:test` | 通过 | `miniprogram-radar tracker` 可输出进度、问题、风险和验证记录 |

## 6. 下一步执行清单

### 6.1 文档收敛

- 后续只维护产品方案、实施总方案、Vercel 生产方案和实施追踪表。
- 新增实施问题时优先更新本追踪表。
- 需要查看当前实施状态时执行 `npx miniprogram-radar tracker` 或 `npm run tracker -- --json`。
- 文档入口变化后执行 `npm run generate` 和 `npm run generate:check`。

### 6.2 生产部署

1. 在 Vercel 导入 GitHub 仓库。
2. 获取 Production URL。
3. 配置 `SITE_URL` 和 `NEXT_PUBLIC_SITE_URL`。
4. 执行：

```bash
npm run vercel:preflight -- <production-url>
npm run deployment:verify -- <production-url>
```

### 6.3 数据与集成

1. 创建 Neon 或 Supabase Postgres。
2. 配置 `DATABASE_URL`。
3. 执行：

```bash
npm run db:migrate
npm run db:import
EXPECT_DATABASE=1 npm run db:verify
```

4. 配置 `CRON_SECRET`、`ADMIN_TOKEN`、`GITHUB_TOKEN`、Redis 和 Blob。
5. 执行：

```bash
EXPECT_GITHUB=1 EXPECT_BLOB=1 EXPECT_UPSTASH_REDIS=1 npm run integrations:verify
VERIFY_CRON_SECRET=<CRON_SECRET> VERIFY_ADMIN_TOKEN=<ADMIN_TOKEN> npm run deployment:verify -- <production-url>
```

## 7. 更新规则

- 每次完成一个阶段，把状态改为 `已完成` 并补充验证证据。
- 每次发现问题，新增到“当前问题清单”，不要只写在聊天记录里。
- 每次解决问题，保留问题记录，把状态改为 `已关闭` 并写明处理方式。
- 每次新增生产依赖，必须补充环境变量、验证命令和降级策略。
- 不把真实 AI 视为默认完成项；只有用户确认并完成线上验证后才标记完成。
