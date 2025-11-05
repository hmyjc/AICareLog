#!/bin/bash

echo "============================================"
echo "健康档案助手 - Taro 微信小程序启动脚本"
echo "============================================"
echo ""

cd frontend-taro

echo "[1/3] 检查依赖..."
if [ ! -d "node_modules" ]; then
    echo "依赖未安装，正在安装..."
    pnpm install
else
    echo "依赖已安装"
fi

echo ""
echo "[2/3] 编译微信小程序..."
echo "编译完成后，请使用微信开发者工具打开 frontend-taro/dist 目录"
echo ""

pnpm dev:weapp



