# 前端一键发布到阿里云 OSS
# 用法：在项目根目录运行 .\deploy-frontend.ps1

$oss = "C:\tools\ossutil\ossutil-v1.7.19-windows-amd64\ossutil64.exe"
$bucket = "oss://geo-teaching-app"
$distDir = "$PSScriptRoot\frontend\dist"

Write-Host ">>> 构建前端..." -ForegroundColor Cyan
Set-Location "$PSScriptRoot\frontend"
npm run build
if ($LASTEXITCODE -ne 0) { Write-Host "构建失败，终止" -ForegroundColor Red; exit 1 }
Set-Location $PSScriptRoot

Write-Host ">>> 上传所有文件到 OSS..." -ForegroundColor Cyan
& $oss cp "$distDir\" "$bucket/" --recursive --update
if ($LASTEXITCODE -ne 0) { Write-Host "上传失败" -ForegroundColor Red; exit 1 }

Write-Host ">>> 修复 Content-Type..." -ForegroundColor Cyan
# 逐个修复所有 html/js/css 文件的 MIME 类型
Get-ChildItem -Path $distDir -Recurse -File | ForEach-Object {
    $rel = $_.FullName.Substring($distDir.Length + 1).Replace('\', '/')
    $ct = switch ($_.Extension) {
        ".html" { "Content-Type:text/html" }
        ".js"   { "Content-Type:application/javascript" }
        ".css"  { "Content-Type:text/css" }
        ".svg"  { "Content-Type:image/svg+xml" }
        ".png"  { "Content-Type:image/png" }
        ".ico"  { "Content-Type:image/x-icon" }
        default { $null }
    }
    if ($ct) {
        Write-Host "  set $rel -> $ct"
        & $oss set-meta "$bucket/$rel" $ct --update | Out-Null
    }
}

Write-Host ">>> 发布完成！" -ForegroundColor Green
Write-Host "访问地址：http://geo-teaching-app.oss-cn-shanghai.aliyuncs.com" -ForegroundColor Yellow
