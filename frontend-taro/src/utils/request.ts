import Taro from '@tarojs/taro'
import { API_BASE_URL } from '../config/api'

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: any
}

export const request = async (url: string, options: RequestOptions = {}) => {
  const { method = 'GET', data, header = {} } = options

  try {
    Taro.showLoading({ title: '加载中...' })

    const response = await Taro.request({
      url: `${API_BASE_URL}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...header,
      },
    })

    Taro.hideLoading()

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return response.data
    } else {
      throw new Error(`请求失败: ${response.statusCode}`)
    }
  } catch (error) {
    Taro.hideLoading()
    Taro.showToast({
      title: '网络请求失败',
      icon: 'none',
    })
    throw error
  }
}

