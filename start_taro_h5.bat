@echo off
echo ================================
echo 健康档案助手 - Taro H5 启动脚本
echo ================================
echo.

cd frontend-taro

echo [1/3] 检查依赖...
if not exist "node_modules" (
    echo 依赖未安装，正在安装...
    call pnpm install
) else (
    echo 依赖已安装
)

echo.
echo [2/3] 启动 Taro H5 开发服务器...
echo 浏览器将自动打开 https://api.medai.medai-zjgsu.cn:3000
echo 按 Ctrl+C 停止服务器
echo.

call pnpm dev:h5

pause




