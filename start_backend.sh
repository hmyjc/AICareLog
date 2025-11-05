#!/bin/bash

# 启动后端服务脚本

echo "正在启动健康档案助手后端服务..."

# 检查Python是否安装
if ! command -v python3 &> /dev/null; then
    echo "错误: 未找到Python3，请先安装Python3"
    exit 1
fi

# 检查依赖是否安装
echo "检查依赖..."
pip3 show fastapi > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "正在安装依赖..."
    pip3 install -r requirements.txt
fi

# 进入后端目录
cd backend

# 启动服务
echo "启动FastAPI服务..."
python3 app.py





