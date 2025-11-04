#!/bin/bash

# 启动前端服务脚本

echo "正在启动健康档案助手前端服务..."

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "错误: 未找到Node.js，请先安装Node.js"
    exit 1
fi

# 进入前端目录
cd frontend

# 检查pnpm是否安装
if ! command -v pnpm &> /dev/null; then
    echo "正在安装pnpm..."
    npm install -g pnpm
fi

# 检查node_modules是否存在
if [ ! -d "node_modules" ]; then
    echo "正在安装依赖..."
    pnpm install
fi

# 启动服务
echo "启动Vite开发服务器..."
pnpm dev

