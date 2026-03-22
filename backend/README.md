# Geo Teaching App — Backend

Spring Boot 认证与基础 API 后端骨架。

## 技术栈

- Java 21
- Spring Boot 3.4
- Maven (使用内置 Maven Wrapper)

## API 接口

| 方法   | 路径                            | 说明         |
|--------|--------------------------------|-------------|
| GET    | `/health`                      | 健康检查     |
| POST   | `/api/v1/auth/register`        | 注册         |
| POST   | `/api/v1/auth/login/password`  | 密码登录     |
| GET    | `/api/v1/auth/me`              | 获取当前用户 |
| POST   | `/api/v1/auth/logout`          | 退出登录     |

## 快速开始

### 运行环境

- Java 21 或更高版本

### 启动开发服务

```bash
sh ./mvnw spring-boot:run
```

默认地址：`http://localhost:4000`

### 构建

```bash
sh ./mvnw package
```

构建产物位于 `target/` 目录。

## 环境变量

| 变量                            | 默认值                          | 说明                           |
|---------------------------------|--------------------------------|-------------------------------|
| `PORT`                          | `4000`                         | 服务端口                       |
| `JWT_SECRET`                    | `replace-this-in-production`   | JWT 签名密钥                   |
| `ACCESS_TOKEN_EXPIRES_IN_HOURS` | `2`                            | Access Token 有效时长（小时）   |
| `CORS_ORIGIN`                   | `http://localhost:5173`        | 允许的跨域来源                  |
| `AUTH_DATA_FILE_PATH`           | `./data/dev-auth-store.json`   | 本地开发数据文件路径             |

## 说明

- 当前默认使用本地 JSON 文件保存开发数据（`data/dev-auth-store.json`）
- 生产环境请将用户数据改为 MySQL
- 注册登录使用账号（手机号/邮箱）+ 密码方式

## 后续演进方向

- 将本地 JSON 存储替换为 MySQL
- 加入 refresh token、风控和审计
