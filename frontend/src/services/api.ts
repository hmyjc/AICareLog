import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://39.104.28.40:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加token等认证信息
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API请求错误:', error);
    return Promise.reject(error);
  }
);

export default api;


// ============ 健康档案相关API ============

export interface BasicInfo {
  nickname: string;
  birth_date: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  blood_type?: string;
}

export interface HealthInfo {
  lifestyle_habits: string[];
  allergies: string[];
  medical_history: string[];
  adverse_reactions: string[];
  family_history: string[];
  surgery_history: Array<{ name: string; date: string }>;
}

export interface OtherInfo {
  vaccination: Array<{ name: string; date: string }>;
  menstruation?: any;
  fertility?: any;
  other_notes?: string;
}

export interface HealthProfile {
  user_id: string;
  basic_info: BasicInfo;
  health_info: HealthInfo;
  other_info: OtherInfo;
  persona_style?: string;
  location?: { province: string; city: string };
}

// 创建健康档案
export const createHealthProfile = (data: HealthProfile) => {
  return api.post('/health-profile', data);
};

// 获取健康档案
export const getHealthProfile = (userId: string) => {
  return api.get(`/health-profile/${userId}`);
};

// 更新健康档案
export const updateHealthProfile = (userId: string, data: any) => {
  return api.put(`/health-profile/${userId}`, data);
};

// 设置用户地区
export const setUserLocation = (userId: string, location: { province: string; city: string }) => {
  return api.post(`/health-profile/${userId}/location`, location);
};


// ============ 人物风格相关API ============

// 获取所有人物风格
export const getPersonaStyles = () => {
  return api.get('/persona-styles');
};

// 选择人物风格
export const selectPersonaStyle = (userId: string, styleName: string) => {
  return api.post(`/persona-styles/${userId}/select`, null, {
    params: { style_name: styleName }
  });
};

// 获取当前人物风格
export const getCurrentPersonaStyle = (userId: string) => {
  return api.get(`/persona-styles/${userId}/current`);
};


// ============ 健康推送相关API ============

// 推送作息提醒
export const pushRestReminder = (userId: string, timeType: string) => {
  return api.post(`/push/rest/${userId}`, null, {
    params: { time_type: timeType }
  });
};

// 推送饮食提醒
export const pushMealReminder = (userId: string, mealType: string) => {
  return api.post(`/push/meal/${userId}`, null, {
    params: { meal_type: mealType }
  });
};

// 推送天气提醒
export const pushWeatherReminder = (userId: string) => {
  return api.post(`/push/weather/${userId}`);
};

// 推送养生妙招
export const pushHealthTip = (userId: string) => {
  return api.post(`/push/health-tip/${userId}`);
};

// 获取推送历史
export const getPushHistory = (userId: string, pushType?: string, limit: number = 20) => {
  return api.get(`/push/history/${userId}`, {
    params: { push_type: pushType, limit }
  });
};

// 标记推送为已读
export const markPushAsRead = (pushId: string, userId: string) => {
  return api.put(`/push/history/${pushId}/read`, null, {
    params: { user_id: userId }
  });
};

