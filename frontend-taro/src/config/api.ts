/**
 * API 配置文件
 * 
 * 注意：
 * - H5 开发时可以使用 localhost
 * - 微信小程序需要使用真实的 IP 地址或域名（必须在微信公众平台配置）
 * - 生产环境应该使用 HTTPS 域名
 */

/**
 * ⚠️ 重要配置说明：
 * 
 * 1. 本地开发（微信小程序）：
 *    - 方式1: 使用电脑的局域网IP（推荐）
 *      例如：http://192.168.1.100:8000/api
 *    - 方式2: 使用后端云服务器地址
 *      例如：http://your-server-ip:8000/api
 * 
 * 2. 如何查看你的局域网IP：
 *    Windows: 打开 CMD，输入 ipconfig，查看 IPv4 地址
 *    Mac/Linux: 打开终端，输入 ifconfig，查看 inet 地址
 * 
 * 3. 微信小程序开发者工具设置：
 *    - 勾选"不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书"
 */

// API 基础地址
// ⚠️ 请修改这里的地址为你的后端地址
export const API_BASE_URL = 'http://localhost:8000/api'

// 如果你的后端部署在服务器上，取消下面的注释并修改
// export const API_BASE_URL = 'http://your-server-ip:8000/api'

// 生产环境使用 HTTPS
// export const API_BASE_URL = 'https://your-api-domain.com/api'

// 导出配置对象
export default {
  API_BASE_URL
}

