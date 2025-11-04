import { View, Form, Input, Button, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { setHasProfile } from '../../store/userSlice'
import { createHealthProfile, getHealthProfile, updateHealthProfile } from '../../services/api'
import './index.scss'

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    nickname: '',
    birth_date: '',
    age: 0,
    gender: '',
    height: 0,
    weight: 0,
    blood_type: '未知',
    lifestyle_habits: [],
    allergies: [],
    medical_history: [],
  })
  const [isEdit, setIsEdit] = useState(false)
  const userId = useSelector((state: RootState) => state.user.userId)
  const dispatch = useDispatch()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const response: any = await getHealthProfile(userId)
      if (response.status === 'success') {
        const data = response.data
        setFormData({
          nickname: data.basic_info?.nickname || '',
          birth_date: data.basic_info?.birth_date || '',
          age: data.basic_info?.age || 0,
          gender: data.basic_info?.gender || '',
          height: data.basic_info?.height || 0,
          weight: data.basic_info?.weight || 0,
          blood_type: data.basic_info?.blood_type || '未知',
          lifestyle_habits: data.health_info?.lifestyle_habits || [],
          allergies: data.health_info?.allergies || [],
          medical_history: data.health_info?.medical_history || [],
        })
        setIsEdit(true)
        dispatch(setHasProfile(true))
      }
    } catch (error: any) {
      if (error.statusCode !== 404) {
        console.error('加载档案失败:', error)
      }
    }
  }

  const handleSubmit = async () => {
    try {
      const profileData = {
        user_id: userId,
        basic_info: {
          nickname: formData.nickname,
          birth_date: formData.birth_date,
          age: formData.age,
          gender: formData.gender,
          height: formData.height,
          weight: formData.weight,
          blood_type: formData.blood_type,
        },
        health_info: {
          lifestyle_habits: formData.lifestyle_habits,
          allergies: formData.allergies,
          medical_history: formData.medical_history,
          adverse_reactions: [],
          family_history: [],
          surgery_history: [],
        },
        other_info: {
          vaccination: [],
          other_notes: '',
        },
      }

      if (isEdit) {
        await updateHealthProfile(userId, {
          basic_info: profileData.basic_info,
          health_info: profileData.health_info,
          other_info: profileData.other_info,
        })
        Taro.showToast({ title: '健康档案更新成功！', icon: 'success' })
      } else {
        await createHealthProfile(profileData)
        Taro.showToast({ title: '健康档案创建成功！', icon: 'success' })
        setIsEdit(true)
        dispatch(setHasProfile(true))
      }
    } catch (error: any) {
      Taro.showToast({
        title: error.response?.data?.detail || '操作失败，请重试',
        icon: 'none',
      })
    }
  }

  const genderOptions = ['男', '女']
  const bloodTypeOptions = ['A', 'B', 'AB', 'O', '未知']

  return (
    <View className='profile-page'>
      <View className='page-title'>{isEdit ? '编辑健康档案' : '创建健康档案'}</View>

      <View className='form-section'>
        <View className='section-title'>基础信息</View>

        <View className='form-item'>
          <View className='label'>昵称 *</View>
          <Input
            className='input'
            placeholder='请输入昵称'
            value={formData.nickname}
            onInput={(e) => setFormData({ ...formData, nickname: e.detail.value })}
          />
        </View>

        <View className='form-item'>
          <View className='label'>出生年月 *</View>
          <Input
            className='input'
            placeholder='格式：1990-01'
            value={formData.birth_date}
            onInput={(e) => setFormData({ ...formData, birth_date: e.detail.value })}
          />
        </View>

        <View className='form-item'>
          <View className='label'>年龄 *</View>
          <Input
            className='input'
            type='number'
            placeholder='请输入年龄'
            value={formData.age.toString()}
            onInput={(e) => setFormData({ ...formData, age: parseInt(e.detail.value) || 0 })}
          />
        </View>

        <View className='form-item'>
          <View className='label'>性别 *</View>
          <Picker
            mode='selector'
            range={genderOptions}
            value={genderOptions.indexOf(formData.gender)}
            onChange={(e) => setFormData({ ...formData, gender: genderOptions[e.detail.value] })}
          >
            <View className='picker'>{formData.gender || '请选择性别'}</View>
          </Picker>
        </View>

        <View className='form-item'>
          <View className='label'>身高（cm）*</View>
          <Input
            className='input'
            type='digit'
            placeholder='请输入身高'
            value={formData.height.toString()}
            onInput={(e) => setFormData({ ...formData, height: parseFloat(e.detail.value) || 0 })}
          />
        </View>

        <View className='form-item'>
          <View className='label'>体重（kg）*</View>
          <Input
            className='input'
            type='digit'
            placeholder='请输入体重'
            value={formData.weight.toString()}
            onInput={(e) => setFormData({ ...formData, weight: parseFloat(e.detail.value) || 0 })}
          />
        </View>

        <View className='form-item'>
          <View className='label'>血型</View>
          <Picker
            mode='selector'
            range={bloodTypeOptions}
            value={bloodTypeOptions.indexOf(formData.blood_type)}
            onChange={(e) => setFormData({ ...formData, blood_type: bloodTypeOptions[e.detail.value] })}
          >
            <View className='picker'>{formData.blood_type || '请选择血型'}</View>
          </Picker>
        </View>
      </View>

      <View className='form-section'>
        <View className='section-title'>健康信息</View>
        <View className='hint-text'>提示：生活习惯、过敏史、既往病史等信息可在H5端或小程序端完善</View>
      </View>

      <View className='submit-button'>
        <Button type='primary' onClick={handleSubmit}>
          {isEdit ? '更新档案' : '创建档案'}
        </Button>
      </View>
    </View>
  )
}

