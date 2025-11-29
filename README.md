# Health Profile Assistant System

A personalized health information push system that provides tailored services through a three-step process: "Create Personal Profile - Customize Push Style - Precise Content Delivery".

## Features

### 1. Personal Health Profile Creation
- **Basic Information**: Nickname, date of birth, age, gender, height, weight, blood type
- **Health Information**: Lifestyle habits, allergy history, medical history, adverse drug reactions, family history, surgical history
- **Other Information**: Vaccination records, menstruation, fertility status, etc.

### 2. Customizable Persona Styles
Support multiple persona styles including:
- Gentle Lady: Warm and caring, like a thoughtful sister
- Caring Mom: Loving and attentive, full of care
- Professional Consultant: Scientific and rigorous, providing professional advice
- Energetic Companion: Light and cheerful, young and vibrant
- Caring Caregiver: Meticulous and thoughtful, attentive to details
- Wise Elder: Experienced, sharing wellness wisdom
- Tech Assistant: Precise and efficient, data-driven
- Fitness Coach: Passionate, encouraging positivity

### 3. Personalized Health Information Push
#### Rest Reminders
- 7:00 AM: Wake-up reminder
- 1:00 PM: Nap reminder
- 11:00 PM: Bedtime reminder

#### Meal Reminders
- 7:30 AM: Breakfast reminder
- 12:00 PM: Lunch reminder
- 6:00 PM: Dinner reminder

#### Weather Push
- Daily weather information and health advice at 7:00 AM

#### Wellness Tips
- Daily wellness tips at 2:00 PM

## Technology Stack

### Backend
- **Framework**: FastAPI
- **Database**: MongoDB
- **LLM**: Alibaba Cloud Bailian (Qwen-Max)
- **Scheduler**: APScheduler
- **Weather Data**: Web Crawler

### Frontend
- **Framework**: React + TypeScript
- **UI Components**: Ant Design
- **State Management**: Redux Toolkit
- **Routing**: React Router
- **Styling**: Tailwind CSS

## Installation and Deployment

### Backend Deployment

1. Install dependencies
```bash
cd health_agent
pip install -r requirements.txt
```

2. Configure database
Edit `backend/config/config.yaml` to configure MongoDB connection and API keys.

3. Start the service
```bash
cd backend
python app.py
```

The service will start at `https://api.medai.medai-zjgsu.cn`.

### Frontend Deployment

1. Install dependencies
```bash
cd frontend
npm install
```

2. Start development server
```bash
npm start
```

The frontend will start at `https://api.medai.medai-zjgsu.cn:3000`.

3. Build for production
```bash
npm run build
```

## API Documentation

After starting the backend service, visit `https://api.medai.medai-zjgsu.cn/docs` to view the complete API documentation.

### Main Endpoints

#### Health Profile Management
- `POST /api/health-profile` - Create health profile
- `GET /api/health-profile/{user_id}` - Get health profile
- `PUT /api/health-profile/{user_id}` - Update health profile
- `POST /api/health-profile/{user_id}/location` - Set user location

#### Persona Styles
- `GET /api/persona-styles` - Get all persona styles
- `POST /api/persona-styles/{user_id}/select` - Select persona style
- `GET /api/persona-styles/{user_id}/current` - Get current style

#### Health Push
- `POST /api/push/rest/{user_id}` - Push rest reminder
- `POST /api/push/meal/{user_id}` - Push meal reminder
- `POST /api/push/weather/{user_id}` - Push weather information
- `POST /api/push/health-tip/{user_id}` - Push wellness tip
- `GET /api/push/history/{user_id}` - Get push history

## Project Structure

```
health_agent/
├── backend/              # Backend code
│   ├── api/             # API endpoints
│   ├── config/          # Configuration files
│   ├── core/            # Core functionality (database connections, etc.)
│   ├── models/          # Data models
│   ├── services/        # Business services
│   ├── scheduler/       # Scheduled tasks
│   ├── utils/           # Utility functions
│   └── app.py           # Main application entry
├── frontend/            # Frontend code
│   ├── public/          # Static assets
│   ├── src/             # Source code
│   │   ├── components/  # Components
│   │   ├── pages/       # Pages
│   │   ├── services/    # API services
│   │   ├── store/       # State management
│   │   └── App.tsx      # Application entry
│   └── package.json
├── requirements.txt     # Python dependencies
└── README.md           # Project documentation
```

## User Guide

1. **Register/Login**: First-time users need to register an account
2. **Fill Profile**: Complete personal health profile
3. **Choose Style**: Select preferred persona style for pushes
4. **Set Location**: Set your location to receive weather pushes
5. **Receive Pushes**: The system will automatically push health information at scheduled times

## Quick Start Scripts

The project includes convenient startup scripts for different platforms:

### Windows
- `start_backend.bat` - Start backend service
- `start_frontend.bat` - Start React frontend
- `start_taro_weapp.bat` - Start Taro WeChat Mini Program
- `start_taro_h5.bat` - Start Taro H5 version

### Linux/Mac
- `start_backend.sh` - Start backend service
- `start_frontend.sh` - Start React frontend
- `start_taro_weapp.sh` - Start Taro WeChat Mini Program
- `start_taro_h5.sh` - Start Taro H5 version

## Recent Bug Fixes

### Scheduled Task Issue
Fixed an issue where scheduled tasks (including weather push) were not executing properly at 7:00 AM daily. The problem was caused by async function declarations without proper synchronous execution in APScheduler. 

**Changes made**:
- Removed `async` keyword from scheduler task methods in `backend/scheduler/tasks.py`
- Added result logging for better monitoring of push operations
- Enhanced error logging to track push failures

The weather push and other scheduled reminders should now work correctly at their designated times.

## Configuration

### Timezone Settings
The scheduler uses `Asia/Shanghai` timezone by default. You can modify this in `backend/config/config.yaml`:

```yaml
scheduler:
  timezone: "Asia/Shanghai"
  rest_times:
    - "07:00"  # Wake-up reminder
    - "13:00"  # Nap reminder
    - "23:00"  # Bedtime reminder
  meal_times:
    - "07:30"  # Breakfast
    - "12:00"  # Lunch
    - "18:00"  # Dinner
  weather_time: "07:00"
  health_tip_time: "14:00"
```

## Development

For secondary development, please refer to code comments and API documentation.

### Development Environment Setup
1. Python 3.8+ required for backend
2. Node.js 16+ required for frontend
3. MongoDB 4.4+ required for database

### Running in Development Mode
```bash
# Backend with auto-reload
cd backend
python app.py

# Frontend with hot-reload
cd frontend
npm start
```

## Troubleshooting

### Issue: Scheduled tasks not executing
- Check if the server time matches the configured timezone
- Verify MongoDB connection is stable
- Check logs in the backend console for task execution status

### Issue: Weather push not working
- Ensure user has set their location in the profile
- Verify weather crawler is functioning correctly
- Check if the location format matches the weather API requirements

## License

MIT License

## Contributors

Welcome contributions! Please feel free to submit pull requests or open issues.

## Support

For questions or support, please refer to the documentation or open an issue on the project repository.

