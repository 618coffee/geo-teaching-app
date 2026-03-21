#!/bin/bash
# ECS 初始化脚本：安装 Java 21 + Nginx，配置前端托管和后端服务
# 在 ECS 上以 root 运行：bash /tmp/setup-ecs.sh

set -e

echo "=== [1/4] 安装依赖 ==="
apt-get update -y
apt-get install -y nginx curl

echo "=== [2/4] 安装 Java 21 ==="
apt-get install -y wget apt-transport-https
wget -qO - https://packages.adoptium.net/artifactory/api/gpg/key/public | apt-key add -
echo "deb https://packages.adoptium.net/artifactory/deb jammy main" > /etc/apt/sources.list.d/adoptium.list
apt-get update -y
apt-get install -y temurin-21-jdk
java -version

echo "=== [3/4] 配置 Nginx ==="
mkdir -p /var/www/geo-teaching-app

cat > /etc/nginx/sites-available/geo-teaching-app << 'EOF'
server {
    listen 80;
    server_name _;

    root /var/www/geo-teaching-app;
    index index.html;

    # 前端 React Router：所有路径都返回 index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 后端 API 反向代理
    location /api/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 健康检查
    location /health {
        proxy_pass http://127.0.0.1:4000;
    }
}
EOF

ln -sf /etc/nginx/sites-available/geo-teaching-app /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
systemctl enable nginx

echo "=== [4/4] 配置后端 systemd 服务 ==="
mkdir -p /opt/geo-teaching-app
mkdir -p /opt/geo-teaching-app/data

cat > /etc/systemd/system/geo-teaching-app.service << 'EOF'
[Unit]
Description=Geo Teaching App Backend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/geo-teaching-app
ExecStart=/usr/bin/java -jar /opt/geo-teaching-app/app.jar
Restart=on-failure
RestartSec=5
Environment=SPRING_PROFILES_ACTIVE=prod
Environment=PORT=4000
Environment=EXPOSE_VERIFICATION_CODE=false
Environment=NOTIFICATION_PROVIDER=mock
Environment=AUTH_DATA_FILE_PATH=/opt/geo-teaching-app/data/auth-store.json
# 生产环境必须修改下面这行！
Environment=JWT_SECRET=change-this-to-a-random-secret-in-production

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable geo-teaching-app

echo ""
echo "=== 初始化完成 ==="
echo "Nginx 已启动，访问 http://$(curl -s ifconfig.me) 可看到（前端文件上传后生效）"
echo ""
echo "下一步："
echo "  1. 从本地运行 deploy-ecs.ps1 上传前端和后端"
echo "  2. 后端上传后运行：systemctl start geo-teaching-app"
echo "  3. 查看后端日志：journalctl -u geo-teaching-app -f"
