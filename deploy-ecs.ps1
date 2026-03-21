# 一键部署前端+后端到阿里云 ECS
# 用法：.\deploy-ecs.ps1 -Host 你的ECS公网IP -KeyFile 你的私钥路径
# 示例：.\deploy-ecs.ps1 -Host 47.1.2.3 -KeyFile C:\Users\guorui\.ssh\geo-teaching.pem

param(
    [Parameter(Mandatory)][string]$Host,
    [string]$SshUser = "root",
    [string]$KeyFile = "",
    [switch]$FrontendOnly,
    [switch]$BackendOnly
)

$sshOpts = "-o StrictHostKeyChecking=no"
if ($KeyFile) { $sshOpts += " -i `"$KeyFile`"" }

function ssh-run($cmd) {
    $expr = "ssh $sshOpts ${SshUser}@${Host} `"$cmd`""
    Invoke-Expression $expr
}

function scp-upload($local, $remote) {
    $expr = "scp $sshOpts `"$local`" ${SshUser}@${Host}:`"$remote`""
    Invoke-Expression $expr
}

$root = $PSScriptRoot

# ─── 前端 ────────────────────────────────────────────────────────────────────
if (-not $BackendOnly) {
    Write-Host "`n>>> [1/2] 构建前端..." -ForegroundColor Cyan
    Push-Location "$root\frontend"
    npm run build
    if ($LASTEXITCODE -ne 0) { Write-Host "前端构建失败" -ForegroundColor Red; exit 1 }
    Pop-Location

    Write-Host ">>> 上传前端文件..." -ForegroundColor Cyan
    ssh-run "mkdir -p /var/www/geo-teaching-app"
    # 打包 dist 目录，用 tar 传输更快
    $tarPath = "$root\frontend\dist.tar.gz"
    Push-Location "$root\frontend"
    tar -czf $tarPath -C dist .
    Pop-Location
    scp-upload $tarPath "/tmp/dist.tar.gz"
    ssh-run "tar -xzf /tmp/dist.tar.gz -C /var/www/geo-teaching-app && rm /tmp/dist.tar.gz"
    Remove-Item $tarPath -ErrorAction SilentlyContinue
    Write-Host ">>> 前端部署完成" -ForegroundColor Green
}

# ─── 后端 ────────────────────────────────────────────────────────────────────
if (-not $FrontendOnly) {
    Write-Host "`n>>> [2/2] 构建后端..." -ForegroundColor Cyan
    Push-Location "$root\backend"
    .\mvnw.cmd package -DskipTests
    if ($LASTEXITCODE -ne 0) { Write-Host "后端构建失败" -ForegroundColor Red; exit 1 }
    Pop-Location

    Write-Host ">>> 上传后端 JAR..." -ForegroundColor Cyan
    $jar = Get-ChildItem "$root\backend\target\*.jar" | Where-Object { $_.Name -notlike "*plain*" } | Select-Object -First 1
    ssh-run "mkdir -p /opt/geo-teaching-app"
    scp-upload $jar.FullName "/opt/geo-teaching-app/app.jar"

    Write-Host ">>> 重启后端服务..." -ForegroundColor Cyan
    ssh-run "systemctl restart geo-teaching-app 2>/dev/null || echo 'service not yet configured'"
    Write-Host ">>> 后端部署完成" -ForegroundColor Green
}

Write-Host "`n✓ 部署完成！访问：http://$Host" -ForegroundColor Yellow
