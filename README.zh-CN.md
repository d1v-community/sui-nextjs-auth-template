# Sui Studio（pnpm Monorepo）

这个仓库基于 **Sui dApp Starter** 构建，感谢原项目提供的基础能力；这里更关注当前仓库本身完成的工作，包括 Next.js 前端、Move 合约部署流程、钱包连接流程、数据库用户同步，以及根目录下的 Vercel 部署方案。

- `packages/frontend`：Next.js 前端
- `packages/backend`：Move 合约 + Suibase 相关脚本

目前这个项目主要包含：

- 自定义钱包连接 UI 和链上交互入口
- 基于 `NEXT_PUBLIC_*_CONTRACT_PACKAGE_ID` 的多网络合约调用配置
- 合约部署后自动把 `packageId` 写入 `packages/frontend/.env.local`
- 通过 Next.js 路由处理器完成钱包用户自动同步入库
- SQL migration 执行器和 migration 文件生成能力
- 基于根目录 [`vercel.json`](/Users/apple/project/sui-nextjs-auth-template/vercel.json) 的 Vercel 部署配置

## 环境要求

- Node.js >= 20
- pnpm（建议使用项目声明的版本）
- Suibase（用于本地链/网络工具）

## 安装依赖

在仓库根目录执行：

```bash
pnpm install
```

## 本地开发（从根目录启动前端）

在仓库根目录执行：

```bash
pnpm dev
```

该命令会启动 `packages/frontend` 的 Next.js 开发服务器。

## 后端（Move 合约）如何部署

这里的“后端”指的是 Move 合约包。部署合约后，会自动把最新的 `packageId` 写入前端的 `packages/frontend/.env.local`，供前端调用。

### Localnet（推荐用于开发）

1) 启动本地网络（会同时启动本地 Explorer）：

```bash
pnpm localnet:start
```

2) 部署合约到 localnet：

```bash
pnpm localnet:deploy
```

部署成功后会自动创建/更新：

- `packages/frontend/.env.local`
- 写入 `NEXT_PUBLIC_LOCALNET_CONTRACT_PACKAGE_ID=...`

### Devnet / Testnet / Mainnet

1) 确保对应网络环境已准备好：

```bash
pnpm devnet:start
# 或：pnpm testnet:start
# 或：pnpm mainnet:start
```

2) 部署合约：

```bash
pnpm devnet:deploy
# 或：pnpm testnet:deploy
# 或：pnpm mainnet:deploy
```

部署成功后会自动写入（在 `packages/frontend/.env.local`）：

- `NEXT_PUBLIC_DEVNET_CONTRACT_PACKAGE_ID=...`
- `NEXT_PUBLIC_TESTNET_CONTRACT_PACKAGE_ID=...`
- `NEXT_PUBLIC_MAINNET_CONTRACT_PACKAGE_ID=...`

注意：

- Mainnet 没有水龙头，需要你自己的地址里有足够的 SUI 作为 gas。
- 常用辅助命令：`pnpm devnet:address` / `pnpm testnet:address` / `pnpm mainnet:address` 以及 `pnpm devnet:links` / `pnpm testnet:links` / `pnpm mainnet:links`。
- 如果遇到依赖校验/版本不匹配问题，可以使用 `*:deploy:no-dependency-check` 相关脚本（谨慎使用）。
- `.env.local` 是本地文件（默认不会提交到 Git）。如果你在 CI/云端部署前端（例如 Vercel），也需要在对应环境里配置同名环境变量（Vercel Project Settings -> Environment Variables，或使用 `vercel env add ...`）。

## Localnet 常用命令（补充）

查看状态：

```bash
pnpm localnet:status
```

停止本地网络（和本地 Explorer）：

```bash
pnpm localnet:stop
```

给某个地址打水（localnet）：

```bash
pnpm localnet:faucet 0xYOURADDRESS
```

## 部署前端到 Vercel（从根目录）

推荐用根目录脚本直接部署 `packages/frontend`：

```bash
pnpm vercel:prod
```

它现在等价于在根目录执行：

```bash
vercel --prod
```

根目录新增了 [`vercel.json`](/Users/apple/project/sui-nextjs-auth-template/vercel.json)，Vercel 会：

- 构建 `packages/frontend` 这个 Next.js 应用
- 以 Next.js 应用方式部署，而不是纯静态导出

因此，不管是本地直接跑 `vercel --prod`，还是在 Vercel Dashboard 导入仓库，都建议把 **Root Directory** 保持在仓库根目录，让这份配置生效。

## 数据库与 SQL 迁移

前端现在已经支持通过 Next.js 服务端路由直接访问数据库。

必需环境变量：

- `DATABASE_URL=...`

目前已经包含：

- 钱包登录后自动同步用户：钱包连接成功时，前端会调用 [`/api/users`](/Users/apple/project/sui-nextjs-auth-template/packages/frontend/src/app/api/users/route.ts)，把用户 upsert 到数据库
- SQL 迁移执行器：按顺序执行 `.sql` 文件，并记录到 `schema_migrations`
- SQL 迁移生成器：可以连续生成 `00001_init.sql`、`00002_xxx.sql` 这种文件

常用命令：

```bash
pnpm --filter frontend db:create-migration add_profiles
pnpm --filter frontend db:migrate
pnpm --filter frontend test
```

迁移文件目录：

- [`packages/frontend/db/migrations`](/Users/apple/project/sui-nextjs-auth-template/packages/frontend/db/migrations)

`00001_init.sql` 已经帮你生成好了，位置在：

- [`packages/frontend/db/migrations/00001_init.sql`](/Users/apple/project/sui-nextjs-auth-template/packages/frontend/db/migrations/00001_init.sql)

当前数据库行为：

- 迁移会在现有 `users` 表上补齐钱包相关字段
- 钱包连接后会按 `wallet_address` 创建或更新用户
- 当前会写入 `wallet_address`、`wallet_name`、`chain`、`last_seen_at`

## 其他命令

根目录的 `package.json` 里封装了常用命令（例如 `build`、`lint`、各种网络的 deploy 等）；你也可以进入子项目目录分别运行它们自己的脚本。
