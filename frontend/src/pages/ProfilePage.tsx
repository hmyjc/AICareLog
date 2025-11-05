import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, Button, Card, Space, message, Divider, Tag } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setHasProfile } from '../store/userSlice';
import { createHealthProfile, getHealthProfile, updateHealthProfile } from '../services/api';

const { TextArea } = Input;
const { Option } = Select;

const ProfilePage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const userId = useSelector((state: RootState) => state.user.userId);
  const dispatch = useDispatch();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response: any = await getHealthProfile(userId);
      if (response.status === 'success') {
        form.setFieldsValue(response.data);
        setIsEdit(true);
        dispatch(setHasProfile(true));
      }
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error('加载档案失败:', error);
      }
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const profileData = {
        user_id: userId,
        ...values,
      };

      if (isEdit) {
        await updateHealthProfile(userId, values);
        message.success('健康档案更新成功！');
      } else {
        await createHealthProfile(profileData);
        message.success('健康档案创建成功！');
        setIsEdit(true);
        dispatch(setHasProfile(true));
      }
    } catch (error: any) {
      message.error(error.response?.data?.detail || '操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 生活习惯选项
  const lifestyleOptions = ['久坐', '熬夜', '口味偏咸', '口味偏辣', '口味偏甜', '吸烟', '饮酒', '规律运动', '规律作息'];
  
  // 常见过敏原
  const allergyOptions = ['青霉素', '头孢', '鸡蛋', '牛奶', '海鲜', '花粉', '尘螨', '芒果', '坚果'];
  
  // 常见疾病
  const diseaseOptions = ['高血压', '糖尿病', '高血脂', '心脏病', '哮喘', '乙肝', '胃病', '关节炎'];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>
        {isEdit ? '编辑健康档案' : '创建健康档案'}
      </h2>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          basic_info: {
            blood_type: '未知',
          },
          health_info: {
            lifestyle_habits: [],
            allergies: [],
            medical_history: [],
            adverse_reactions: [],
            family_history: [],
            surgery_history: [],
          },
          other_info: {
            vaccination: [],
          },
        }}
      >
        <Card title="基础信息" style={{ marginBottom: 16 }}>
          <Form.Item
            label="昵称"
            name={['basic_info', 'nickname']}
            rules={[{ required: true, message: '请输入昵称' }]}
          >
            <Input placeholder="请输入昵称" />
          </Form.Item>

          <Form.Item
            label="出生年月"
            name={['basic_info', 'birth_date']}
            rules={[{ required: true, message: '请输入出生年月' }]}
          >
            <Input placeholder="格式：1990-01" />
          </Form.Item>

          <Form.Item
            label="年龄"
            name={['basic_info', 'age']}
            rules={[{ required: true, message: '请输入年龄' }]}
          >
            <InputNumber min={0} max={150} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="性别"
            name={['basic_info', 'gender']}
            rules={[{ required: true, message: '请选择性别' }]}
          >
            <Select placeholder="请选择性别">
              <Option value="男">男</Option>
              <Option value="女">女</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="身高（cm）"
            name={['basic_info', 'height']}
            rules={[{ required: true, message: '请输入身高' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="体重（kg）"
            name={['basic_info', 'weight']}
            rules={[{ required: true, message: '请输入体重' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="血型" name={['basic_info', 'blood_type']}>
            <Select placeholder="请选择血型">
              <Option value="A">A型</Option>
              <Option value="B">B型</Option>
              <Option value="AB">AB型</Option>
              <Option value="O">O型</Option>
              <Option value="未知">未知</Option>
            </Select>
          </Form.Item>
        </Card>

        <Card title="健康信息" style={{ marginBottom: 16 }}>
          <Form.Item label="生活习惯" name={['health_info', 'lifestyle_habits']}>
            <Select mode="tags" placeholder="选择或输入生活习惯">
              {lifestyleOptions.map(item => (
                <Option key={item} value={item}>{item}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="过敏史" name={['health_info', 'allergies']}>
            <Select mode="tags" placeholder="选择或输入过敏原">
              {allergyOptions.map(item => (
                <Option key={item} value={item}>{item}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="既往病史" name={['health_info', 'medical_history']}>
            <Select mode="tags" placeholder="选择或输入疾病">
              {diseaseOptions.map(item => (
                <Option key={item} value={item}>{item}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="药品不良反应" name={['health_info', 'adverse_reactions']}>
            <Select mode="tags" placeholder="输入药品不良反应" />
          </Form.Item>

          <Form.Item label="家族史" name={['health_info', 'family_history']}>
            <Select mode="tags" placeholder="输入家族病史" />
          </Form.Item>

          <Divider plain>手术史</Divider>
          <Form.List name={['health_info', 'surgery_history']}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      rules={[{ required: true, message: '请输入手术名称' }]}
                    >
                      <Input placeholder="手术名称" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'date']}
                      rules={[{ required: true, message: '请输入手术时间' }]}
                    >
                      <Input placeholder="时间（如：2020-01）" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    添加手术史
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>

        <Card title="其他信息" style={{ marginBottom: 16 }}>
          <Divider plain>疫苗接种记录</Divider>
          <Form.List name={['other_info', 'vaccination']}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      rules={[{ required: true, message: '请输入疫苗名称' }]}
                    >
                      <Input placeholder="疫苗名称" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'date']}
                      rules={[{ required: true, message: '请输入接种时间' }]}
                    >
                      <Input placeholder="时间（如：2023-01）" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    添加疫苗接种记录
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item label="其他备注" name={['other_info', 'other_notes']}>
            <TextArea rows={4} placeholder="其他需要说明的健康信息" />
          </Form.Item>
        </Card>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} size="large" block>
            {isEdit ? '更新档案' : '创建档案'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProfilePage;






