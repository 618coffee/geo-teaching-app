# Geo Teaching App Server

Spring Boot 认证与基础 API 后端骨架。

## 当前能力

- `GET /health`
- `POST /api/v1/auth/send-code`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login/password`
- `POST /api/v1/auth/login/code`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/logout`

## 本地启动

```bash
sh ./mvnw spring-boot:run
```

默认地址：`http://localhost:4000`

## 说明

- 当前默认使用本地 JSON 文件保存开发数据，路径为 `server/data/dev-auth-store.json`
- 当前默认使用 `mock` 通知通道，不会真实发送短信或邮件
- 生产环境请将用户数据改为 MySQL，将验证码和限流改为 Redis
- 阿里云接口与部署方案见根目录 `docs/aliyun-auth-backend-plan.md`
