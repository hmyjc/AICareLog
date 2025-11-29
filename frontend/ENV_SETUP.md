# 环境变量配置说明

## 创建 .env 文件

在 `frontend` 目录下创建 `.env` 文件，内容如下：

```
VITE_API_URL=https://api.medai.medai-zjgsu.cn/api
```

## 说明

- `VITE_API_URL`: 后端API的基础URL
  - 开发环境：`https://api.medai.medai-zjgsu.cn/api`
  - 生产环境：根据实际部署的后端地址修改

## 使用方法

在代码中通过以下方式访问环境变量：

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## 注意事项

1. `.env` 文件已被添加到 `.gitignore`，不会提交到版本控制
2. 所有环境变量必须以 `VITE_` 开头才能在客户端代码中访问
3. 修改环境变量后需要重启开发服务器才能生效







