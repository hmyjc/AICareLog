import { View, Button, Picker, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { pushWeatherReminder, getPushHistory, setUserLocation, getHealthProfile } from '../../services/api'
import './index.scss'

export default function WeatherPage() {
  const [province, setProvince] = useState('')
  const [city, setCity] = useState('')
  const [locationSet, setLocationSet] = useState(false)
  const [latestContent, setLatestContent] = useState('')
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const userId = useSelector((state: RootState) => state.user.userId)

  // 省市数据（简化版，实际应用中应该完整）
  const cityData: Record<string, string[]> = {
    '浙江': ['杭州', '宁波', '温州', '嘉兴', '湖州', '绍兴', '金华', '衢州', '舟山', '台州', '丽水'],
    '江苏': ['南京', '无锡', '徐州', '常州', '苏州', '南通', '连云港', '淮安', '盐城', '扬州', '镇江', '泰州', '宿迁'],
    '北京': ['北京'],
    '上海': ['上海'],
    // 这里应该根据您的CSV文件完整填充所有省市数据
  }

  const provinces = Object.keys(cityData)

  useEffect(() => {
    loadUserProfile()
    loadHistory()
  }, [])

  const loadUserProfile = async () => {
    try {
      const response: any = await getHealthProfile(userId)
      if (response.status === 'success' && response.data.location) {
        const { province, city } = response.data.location
        setProvince(province)
        setCity(city)
        setLocationSet(true)
      }
    } catch (error) {
      console.error('加载用户档案失败:', error)
    }
  }

  const loadHistory = async () => {
    try {
      const response: any = await getPushHistory(userId, 'weather', 10)
      if (response.status === 'success') {
        setHistory(response.data)
        if (response.data.length > 0) {
          setLatestContent(response.data[0].content)
        }
      }
    } catch (error) {
      console.error('加载历史失败:', error)
    }
  }

  const handleSetLocation = async () => {
    if (!province || !city) {
      Taro.showToast({ title: '请选择省份和城市', icon: 'none' })
      return
    }

    try {
      await setUserLocation(userId, { province, city })
      setLocationSet(true)
      Taro.showToast({ title: '地区设置成功！', icon: 'success' })
    } catch (error: any) {
      Taro.showToast({
        title: error.response?.data?.detail || '设置失败',
        icon: 'none',
      })
    }
  }

  const handlePush = async () => {
    if (!locationSet) {
      Taro.showToast({ title: '请先设置所在地区', icon: 'none' })
      return
    }

    setLoading(true)
    try {
      const response: any = await pushWeatherReminder(userId)
      if (response.status === 'success') {
        setLatestContent(response.content)
        Taro.showToast({ title: '推送成功！', icon: 'success' })
        loadHistory()
      } else if (response.status === 'error') {
        Taro.showToast({ title: response.message, icon: 'none', duration: 3000 })
      }
    } catch (error: any) {
      Taro.showToast({
        title: error.response?.data?.detail || '推送失败',
        icon: 'none',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className='weather-page'>
      <View className='page-title'>☁️ 天气推送</View>
      <View className='page-desc'>系统会在每天早上7:00自动推送天气信息和健康建议</View>

      <View className='location-section'>
        <View className='section-title'>📍 设置所在地区</View>

        <View className='form-item'>
          <Picker
            mode='selector'
            range={provinces}
            value={provinces.indexOf(province)}
            onChange={(e) => {
              const selectedProvince = provinces[e.detail.value]
              setProvince(selectedProvince)
              setCity('') // 重置城市
            }}
          >
            <View className='picker'>{province || '选择省份'}</View>
          </Picker>
        </View>

        <View className='form-item'>
          <Picker
            mode='selector'
            range={province ? cityData[province] : []}
            value={province ? cityData[province].indexOf(city) : 0}
            onChange={(e) => {
              if (province) {
                setCity(cityData[province][e.detail.value])
              }
            }}
          >
            <View className='picker'>{city || '选择城市'}</View>
          </Picker>
        </View>

        <Button type='primary' onClick={handleSetLocation}>
          保存地区
        </Button>
      </View>

      <View className='push-section'>
        <View className='section-title'>获取天气推送</View>
        <Button type='primary' loading={loading} onClick={handlePush}>
          🌤️ 获取今日天气
        </Button>
      </View>

      {latestContent && (
        <View className='latest-content'>
          <View className='section-title'>最新推送内容</View>
          <View className='content-card'>{latestContent}</View>
        </View>
      )}

      {history.length > 0 && (
        <View className='history-section'>
          <View className='section-title'>历史推送</View>
          <ScrollView scrollY className='history-list'>
            {history.map((item, index) => (
              <View key={index} className='history-item'>
                <View className='time'>{item.push_time}</View>
                <View className='content'>{item.content}</View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  )
}

