@echo off
echo ============================================
echo 健康档案助手 - Taro 微信小程序启动脚本
echo ============================================
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
echo [2/3] 编译微信小程序...
echo 编译完成后，请使用微信开发者工具打开 frontend-taro\dist 目录
echo.

call pnpm dev:weapp

pause





