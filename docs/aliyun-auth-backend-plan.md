# 阿里云认证接口与部署方案

## 目标

本文档面向当前教学应用的统一登录注册场景，目标是落地一套适合中国大陆用户的认证后端方案，满足以下要求：

- 支持中国大陆手机号注册和登录
- 支持邮箱注册和登录，作为手机号的补充通道
- 注册时必须通过验证码校验
- 支持密码登录与验证码登录两种模式
- 能平滑支撑学生端、教师端、运营端三类账号
- 后续可以迁移到正式服务端会话、审计、限流和风控体系

## 推荐云服务组合

### 默认推荐

优先选择阿里云，建议第一版组合如下：

- 计算层：阿里云 SAE
- API 网关入口：ALB 或 Nginx Ingress
- 数据库：阿里云 RDS MySQL
- 缓存与验证码：阿里云 Redis
- 短信：阿里云短信服务
- 邮件：阿里云邮件推送
- 对象存储：阿里云 OSS
- 日志：阿里云日志服务 SLS
- 密钥：阿里云 KMS
- 安全：WAF + 安全组 + VPC

### 为什么优先选阿里云

- 短信、邮件、数据库、Redis、对象存储和备案配套完整
- 中国大陆的教育和内容平台案例多，资料成熟
- 对验证码、登录限流、静态资源分发和日志审计的落地路径更顺手
- 后续如果要接入 AI、推荐、搜索或对象存储，也方便继续扩展

## 部署拓扑

### 推荐拓扑

1. 前端静态资源构建后上传到 OSS
2. OSS 前面挂 CDN，域名在中国大陆完成备案
3. 后端 API 以容器方式部署到 SAE
4. SAE 通过 VPC 内网访问 RDS MySQL 和 Redis
5. 短信验证码走阿里云短信服务
6. 邮箱验证码走阿里云邮件推送
7. 日志统一打到 SLS

### 环境划分

- `dev`：本地开发，验证码直接暴露在接口返回中，用 mock 通知通道
- `staging`：部署到阿里云测试环境，接真实短信/邮件，但限制白名单号码
- `prod`：生产环境，关闭调试验证码返回，开启限流、审计、告警和风控

## 接口设计

统一前缀：`/api/v1`

### 1. 发送验证码

`POST /api/v1/auth/send-code`

请求体：

```json
{
  "account": "13800138000",
  "purpose": "register"
}
```

字段说明：

- `account`：手机号或邮箱
- `purpose`：`register` 或 `login`

成功响应：

```json
{
  "success": true,
  "data": {
    "channel": "phone",
    "expiresInSeconds": 300,
    "retryAfterSeconds": 60,
    "debugCode": "123456"
  }
}
```

说明：

- `debugCode` 仅在本地开发环境返回
- 生产环境必须移除 `debugCode`

### 2. 注册

`POST /api/v1/auth/register`

请求体：

```json
{
  "account": "13800138000",
  "password": "Passw0rd!",
  "code": "123456",
  "displayName": "高一三班 王同学",
  "role": "student"
}
```

成功响应：

```json
{
  "success": true,
  "data": {
    "accessToken": "<jwt>",
    "user": {
      "id": "user_xxx",
      "account": "13800138000",
      "channel": "phone",
      "role": "student",
      "displayName": "高一三班 王同学",
      "createdAt": "2026-03-19T10:00:00.000Z"
    }
  }
}
```

### 3. 密码登录

`POST /api/v1/auth/login/password`

请求体：

```json
{
  "account": "13800138000",
  "password": "Passw0rd!"
}
```

成功响应与注册相同，返回 `accessToken` 和 `user`。

### 4. 验证码登录

`POST /api/v1/auth/login/code`

请求体：

```json
{
  "account": "13800138000",
  "code": "123456"
}
```

成功响应与注册相同，返回 `accessToken` 和 `user`。

### 5. 获取当前登录用户

`GET /api/v1/auth/me`

请求头：

```http
Authorization: Bearer <jwt>
```

成功响应：

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_xxx",
      "account": "13800138000",
      "channel": "phone",
      "role": "student",
      "displayName": "高一三班 王同学",
      "createdAt": "2026-03-19T10:00:00.000Z"
    }
  }
}
```

### 6. 退出登录

`POST /api/v1/auth/logout`

第一版可以做成幂等空操作，前端只需清掉 token。后续如果引入 refresh token 或服务端会话，再改为真正失效。

### 7. 健康检查

`GET /health`

用于 SAE、SLB、监控平台存活探测。

## 数据模型建议

### MySQL 表

#### `users`

- `id`
- `account`
- `channel`
- `role`
- `display_name`
- `password_hash`
- `password_salt`
- `status`
- `created_at`
- `updated_at`
- `last_login_at`

### Redis Key 建议

- `auth:code:register:{account}`：注册验证码
- `auth:code:login:{account}`：登录验证码
- `auth:rate:send-code:{account}`：验证码发送限流
- `auth:rate:login:{account}`：登录失败限流

## 验证码与安全策略

### 基础规则

- 验证码 6 位数字
- 有效期 5 分钟
- 同账号 60 秒内不得重复发送
- 单账号 1 小时内发送次数应受限
- 登录、注册、发码都要记录审计日志

### 密码与会话

- 密码必须使用服务端安全哈希算法存储
- 不允许明文密码落库或落日志
- access token 建议 2 小时内有效
- 第二阶段增加 refresh token 或服务端 session

### 风控建议

- 对短信发送频率做账号级和 IP 级双重限流
- 对验证码错误次数做限制
- 对异常 IP、异常设备、批量号码尝试增加拦截
- 对运营端账号启用更严格的密码策略和二次验证

## 阿里云服务对接建议

### 短信

建议使用阿里云短信服务，准备：

- 短信签名
- 短信模板
- RAM 子账号 AccessKey

服务端在发送验证码时，需要把：

- 手机号
- 模板 code
- 模板参数中的验证码

提交给短信 SDK 或网关接口。

### 邮件

建议使用阿里云邮件推送：

- 用于邮箱验证码、找回密码、邀请通知
- 需要配置发信域名和发信地址

### 数据库与缓存

- 用户主数据放 RDS MySQL
- 验证码、限流、短时登录态放 Redis
- 不建议把验证码长期存数据库作为主实现

## SAE 部署方案

### 构建方式

1. 为后端编写 `Dockerfile`
2. 构建镜像并推送到阿里云 ACR
3. 在 SAE 创建应用，选择镜像部署
4. 配置环境变量、VPC、RDS、Redis
5. 绑定 SLB 或 ALB 暴露 API

### 环境变量建议

- `PORT`
- `CORS_ORIGIN`
- `JWT_SECRET`
- `EXPOSE_VERIFICATION_CODE`
- `NOTIFICATION_PROVIDER`
- `ALIYUN_SMS_SIGN_NAME`
- `ALIYUN_SMS_TEMPLATE_CODE`
- `ALIYUN_EMAIL_ACCOUNT_NAME`

### 生产发布顺序

1. 先准备 RDS、Redis、ACR、SLS
2. 再发布 SAE 应用
3. 配置短信与邮件服务参数
4. 联调验证码链路
5. 最后切 CDN、域名和 HTTPS

## 当前仓库对应关系

当前仓库的 `backend/` 目录是第一版后端骨架，特点是：

- 与本文档接口路径保持一致
- 基于 Spring Boot，便于后续接入统一鉴权、审计与中后台能力
- 默认使用本地 JSON 文件保存开发数据
- 默认使用 mock 通知通道模拟短信/邮件发送
- 便于后续替换为 MySQL、Redis 和阿里云正式通知服务

下一步如果继续推进，优先顺序建议是：

1. 把前端 `AuthContext` 切换为真实 API 调用
2. 把后端本地 JSON 存储替换为 MySQL + Redis
3. 接入阿里云短信和邮件推送
4. 加入 refresh token、风控和审计
