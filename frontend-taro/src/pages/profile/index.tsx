import { View, Input, Button, Picker, Textarea } from '@tarojs/components'
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
    lifestyle_habits: '',
    allergies: '',
    medical_history: '',
    adverse_reactions: '',
    family_history: '',
    surgery_history: '',
    vaccination: '',
    other_notes: '',
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
          lifestyle_habits: data.health_info?.lifestyle_habits?.join('、') || '',
          allergies: data.health_info?.allergies?.join('、') || '',
          medical_history: data.health_info?.medical_history?.join('、') || '',
          adverse_reactions: data.health_info?.adverse_reactions?.join('、') || '',
          family_history: data.health_info?.family_history?.join('、') || '',
          surgery_history: data.health_info?.surgery_history?.map(s => `${s.name}(${s.date})`).join('、') || '',
          vaccination: data.other_info?.vaccination?.map(v => `${v.name}(${v.date})`).join('、') || '',
          other_notes: data.other_info?.other_notes || '',
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
          lifestyle_habits: formData.lifestyle_habits ? formData.lifestyle_habits.split(/[、,，]/).filter(Boolean) : [],
          allergies: formData.allergies ? formData.allergies.split(/[、,，]/).filter(Boolean) : [],
          medical_history: formData.medical_history ? formData.medical_history.split(/[、,，]/).filter(Boolean) : [],
          adverse_reactions: formData.adverse_reactions ? formData.adverse_reactions.split(/[、,，]/).filter(Boolean) : [],
          family_history: formData.family_history ? formData.family_history.split(/[、,，]/).filter(Boolean) : [],
          surgery_history: [],
        },
        other_info: {
          vaccination: [],
          other_notes: formData.other_notes,
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
        
        <View className='form-item'>
          <View className='label'>生活习惯</View>
          <Input
            className='input'
            placeholder='例如：久坐、熬夜、规律运动（用顿号或逗号分隔）'
            value={formData.lifestyle_habits}
            onInput={(e) => setFormData({ ...formData, lifestyle_habits: e.detail.value })}
          />
        </View>

        <View className='form-item'>
          <View className='label'>过敏史</View>
          <Input
            className='input'
            placeholder='例如：青霉素、海鲜、花粉（用顿号或逗号分隔）'
            value={formData.allergies}
            onInput={(e) => setFormData({ ...formData, allergies: e.detail.value })}
          />
        </View>

        <View className='form-item'>
          <View className='label'>既往病史</View>
          <Input
            className='input'
            placeholder='例如：高血压、糖尿病（用顿号或逗号分隔）'
            value={formData.medical_history}
            onInput={(e) => setFormData({ ...formData, medical_history: e.detail.value })}
          />
        </View>

        <View className='form-item'>
          <View className='label'>药品不良反应</View>
          <Input
            className='input'
            placeholder='例如：阿司匹林过敏（用顿号或逗号分隔）'
            value={formData.adverse_reactions}
            onInput={(e) => setFormData({ ...formData, adverse_reactions: e.detail.value })}
          />
        </View>

        <View className='form-item'>
          <View className='label'>家族史</View>
          <Input
            className='input'
            placeholder='例如：高血压、心脏病（用顿号或逗号分隔）'
            value={formData.family_history}
            onInput={(e) => setFormData({ ...formData, family_history: e.detail.value })}
          />
        </View>

        <View className='form-item'>
          <View className='label'>手术史</View>
          <Input
            className='input'
            placeholder='例如：阑尾切除(2020-01)（用顿号或逗号分隔）'
            value={formData.surgery_history}
            onInput={(e) => setFormData({ ...formData, surgery_history: e.detail.value })}
          />
        </View>
      </View>

      <View className='form-section'>
        <View className='section-title'>其他信息</View>
        
        <View className='form-item'>
          <View className='label'>疫苗接种记录</View>
          <Input
            className='input'
            placeholder='例如：新冠疫苗(2023-01)（用顿号或逗号分隔）'
            value={formData.vaccination}
            onInput={(e) => setFormData({ ...formData, vaccination: e.detail.value })}
          />
        </View>

        <View className='form-item'>
          <View className='label'>其他备注</View>
          <Textarea
            className='textarea'
            placeholder='其他需要说明的健康信息'
            value={formData.other_notes}
            onInput={(e) => setFormData({ ...formData, other_notes: e.detail.value })}
          />
        </View>
      </View>

      <View className='submit-button'>
        <Button type='primary' onClick={handleSubmit}>
          {isEdit ? '更新档案' : '创建档案'}
        </Button>
      </View>
    </View>
  )
}



