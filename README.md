# 健康档案助手系统

个性化健康资讯推送系统，通过"建立个人档案-自定义推送风格-精准内容推送"三步流程，为用户提供适配个人健康状况的专属服务。

## 功能特点

### 1. 个人健康档案建立
- **基础信息**：昵称、出生年月、年龄、性别、身高、体重、血型
- **健康信息**：生活习惯、过敏史、既往病史、药品不良反应、家族史、手术史
- **其他信息**：疫苗接种、月经、生育情况等

### 2. 推送人物风格自定义
支持多种人物风格，包括：
- 温柔美女：温柔体贴，像知心姐姐
- 亲切妈妈：慈爱唠叨，充满关爱
- 专业顾问：科学严谨，提供专业建议
- 活力同伴：轻松愉快，年轻活力
- 贴心护工：细心周到，关注细节
- 智慧长者：经验丰富，传授养生智慧
- 科技助手：精准高效，数据驱动
- 运动教练：充满激情，鼓励积极

### 3. 个性化健康资讯推送
#### 作息提醒
- 早上7点：起床提醒
- 中午13点：午睡提醒
- 晚上23点：睡觉提醒

#### 饮食提醒
- 早上7:30：早餐提醒
- 中午12:00：午餐提醒
- 下午18:00：晚餐提醒

#### 天气推送
- 每天早上7点推送天气信息和健康建议

#### 养生妙招
- 每天下午14点推送养生小妙招

## 技术架构

### 后端
- **框架**：FastAPI
- **数据库**：MongoDB
- **大模型**：阿里云百炼 (Qwen-Max)
- **定时任务**：APScheduler
- **天气数据**：爬虫获取

### 前端
- **框架**：React + TypeScript
- **UI组件**：Ant Design
- **状态管理**：Redux Toolkit
- **路由**：React Router
- **样式**：Tailwind CSS

## 安装部署

### 后端部署

1. 安装依赖
```bash
cd health_agent
pip install -r requirements.txt
```

2. 配置数据库
编辑 `backend/config/config.yaml`，配置MongoDB连接信息和API密钥。

3. 启动服务
```bash
cd backend
python app.py
```

服务将在 `http://39.104.28.40:8000` 启动。

### 前端部署

1. 安装依赖
```bash
cd frontend
npm install
```

2. 启动开发服务器
```bash
npm start
```

前端将在 `http://39.104.28.40:3000` 启动。

3. 构建生产版本
```bash
npm run build
```

## API文档

启动后端服务后，访问 `http://39.104.28.40:8000/docs` 查看完整的API文档。

### 主要接口

#### 健康档案管理
- `POST /api/health-profile` - 创建健康档案
- `GET /api/health-profile/{user_id}` - 获取健康档案
- `PUT /api/health-profile/{user_id}` - 更新健康档案
- `POST /api/health-profile/{user_id}/location` - 设置用户地区

#### 人物风格
- `GET /api/persona-styles` - 获取所有人物风格
- `POST /api/persona-styles/{user_id}/select` - 选择人物风格
- `GET /api/persona-styles/{user_id}/current` - 获取当前风格

#### 健康推送
- `POST /api/push/rest/{user_id}` - 推送作息提醒
- `POST /api/push/meal/{user_id}` - 推送饮食提醒
- `POST /api/push/weather/{user_id}` - 推送天气信息
- `POST /api/push/health-tip/{user_id}` - 推送养生妙招
- `GET /api/push/history/{user_id}` - 获取推送历史

## 目录结构

```
health_agent/
├── backend/              # 后端代码
│   ├── api/             # API接口
│   ├── config/          # 配置文件
│   ├── core/            # 核心功能（数据库连接等）
│   ├── models/          # 数据模型
│   ├── services/        # 业务服务
│   ├── scheduler/       # 定时任务
│   ├── utils/           # 工具函数
│   └── app.py           # 主应用入口
├── frontend/            # 前端代码
│   ├── public/          # 静态资源
│   ├── src/             # 源代码
│   │   ├── components/  # 组件
│   │   ├── pages/       # 页面
│   │   ├── services/    # API服务
│   │   ├── store/       # 状态管理
│   │   └── App.tsx      # 应用入口
│   └── package.json
├── requirements.txt     # Python依赖
└── README.md           # 项目说明
```

## 使用说明

1. **注册/登录**：首次使用需要注册账号
2. **填写档案**：完成个人健康档案填写
3. **选择风格**：选择喜欢的推送人物风格
4. **设置地区**：设置所在地区以接收天气推送
5. **接收推送**：系统将自动在设定时间推送健康资讯

## 开发者

如需二次开发，请参考代码注释和API文档。

## 许可证

MIT License



