import React, { useState, useEffect } from 'react';
import { Card, Button, List, Typography, Space, message, Tag, Empty } from 'antd';
import { CoffeeOutlined, ReloadOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { pushMealReminder, getPushHistory } from '../services/api';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;

interface PushRecord {
  _id: string;
  content: string;
  push_time: string;
  is_read: boolean;
}

const MealPage: React.FC = () => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({
    breakfast: false,
    lunch: false,
    dinner: false
  });
  const [latestContent, setLatestContent] = useState<string>('');
  const [history, setHistory] = useState<PushRecord[]>([]);
  const userId = useSelector((state: RootState) => state.user.userId);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response: any = await getPushHistory(userId, 'meal', 10);
      if (response.status === 'success') {
        setHistory(response.data);
        if (response.data.length > 0) {
          setLatestContent(response.data[0].content);
        }
      }
    } catch (error) {
      console.error('加载历史失败:', error);
    }
  };

  const handlePush = async (mealType: string) => {
    setLoadingStates(prev => ({ ...prev, [mealType]: true }));
    try {
      const response: any = await pushMealReminder(userId, mealType);
      if (response.status === 'success') {
        setLatestContent(response.content);
        message.success('推送成功！');
        loadHistory();
      }
    } catch (error: any) {
      message.error(error.response?.data?.detail || '推送失败');
    } finally {
      setLoadingStates(prev => ({ ...prev, [mealType]: false }));
    }
  };

  const mealTypeMap = {
    breakfast: { label: '早餐提醒（7:30）', icon: '🍳' },
    lunch: { label: '午餐提醒（12:00）', icon: '🍱' },
    dinner: { label: '晚餐提醒（18:00）', icon: '🍽️' },
  };

  return (
    <div>
      <Title level={2}>
        <CoffeeOutlined /> 饮食提醒
      </Title>
      <Paragraph type="secondary">
        系统会在每天早上7:30、中午12:00、下午18:00自动推送饮食建议
      </Paragraph>

      <Card title="手动获取提醒" style={{ marginBottom: 24 }}>
        <Space size="middle" wrap>
          {Object.entries(mealTypeMap).map(([key, value]) => (
            <Button
              key={key}
              type="primary"
              icon={<span style={{ marginRight: 4 }}>{value.icon}</span>}
              loading={loadingStates[key]}
              onClick={() => handlePush(key)}
            >
              {value.label}
            </Button>
          ))}
        </Space>
      </Card>

      {latestContent && (
        <Card 
          title="最新推送内容" 
          style={{ marginBottom: 24 }}
          extra={
            <Button 
              type="link" 
              icon={<ReloadOutlined />} 
              onClick={loadHistory}
            >
              刷新
            </Button>
          }
        >
          <div style={{ 
            padding: 16, 
            background: '#fff7e6', 
            borderRadius: 8,
            border: '1px solid #ffd591' 
          }}>
            <Text>{latestContent}</Text>
          </div>
        </Card>
      )}

      <Card title="历史推送记录">
        {history.length > 0 ? (
          <List
            dataSource={history}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <Space>
                      <span>{dayjs(item.push_time).format('YYYY-MM-DD HH:mm')}</span>
                      {!item.is_read && <Tag color="blue">新</Tag>}
                    </Space>
                  }
                  description={item.content}
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty description="暂无推送记录" />
        )}
      </Card>
    </div>
  );
};

export default MealPage;


