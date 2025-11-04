@echo off
echo 正在启动健康档案助手前端服务...

REM 检查Node.js是否安装
node --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到Node.js，请先安装Node.js
    pause
    exit /b 1
)

REM 进入前端目录
cd frontend

REM 检查pnpm是否安装
pnpm --version >nul 2>&1
if errorlevel 1 (
    echo 正在安装pnpm...
    npm install -g pnpm
)

REM 检查node_modules是否存在
if not exist "node_modules\" (
    echo 正在安装依赖...
    pnpm install
)

REM 启动服务
echo 启动Vite开发服务器...
pnpm dev

pause

