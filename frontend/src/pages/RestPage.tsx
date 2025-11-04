import React, { useState, useEffect } from 'react';
import { Card, Button, List, Typography, Space, message, Tag, Empty } from 'antd';
import { ClockCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { pushRestReminder, getPushHistory } from '../services/api';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;

interface PushRecord {
  _id: string;
  content: string;
  push_time: string;
  is_read: boolean;
}

const RestPage: React.FC = () => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({
    morning: false,
    noon: false,
    night: false
  });
  const [latestContent, setLatestContent] = useState<string>('');
  const [history, setHistory] = useState<PushRecord[]>([]);
  const userId = useSelector((state: RootState) => state.user.userId);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response: any = await getPushHistory(userId, 'rest', 10);
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

  const handlePush = async (timeType: string) => {
    setLoadingStates(prev => ({ ...prev, [timeType]: true }));
    try {
      const response: any = await pushRestReminder(userId, timeType);
      if (response.status === 'success') {
        setLatestContent(response.content);
        message.success('推送成功！');
        loadHistory();
      }
    } catch (error: any) {
      message.error(error.response?.data?.detail || '推送失败');
    } finally {
      setLoadingStates(prev => ({ ...prev, [timeType]: false }));
    }
  };

  const timeTypeMap = {
    morning: { label: '早起提醒（7:00）', icon: '🌅' },
    noon: { label: '午睡提醒（13:00）', icon: '😴' },
    night: { label: '睡觉提醒（23:00）', icon: '🌙' },
  };

  return (
    <div>
      <Title level={2}>
        <ClockCircleOutlined /> 作息提醒
      </Title>
      <Paragraph type="secondary">
        系统会在每天早上7点、中午13点、晚上23点自动推送作息提醒
      </Paragraph>

      <Card title="手动获取提醒" style={{ marginBottom: 24 }}>
        <Space size="middle" wrap>
          {Object.entries(timeTypeMap).map(([key, value]) => (
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
            background: '#f6ffed', 
            borderRadius: 8,
            border: '1px solid #b7eb8f' 
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

export default RestPage;


