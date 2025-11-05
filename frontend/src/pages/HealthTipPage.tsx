import React, { useState, useEffect } from 'react';
import { Card, Button, List, Typography, Space, message, Tag, Empty } from 'antd';
import { HeartOutlined, ReloadOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { pushHealthTip, getPushHistory } from '../services/api';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;

interface PushRecord {
  _id: string;
  content: string;
  push_time: string;
  is_read: boolean;
}

const HealthTipPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [latestContent, setLatestContent] = useState<string>('');
  const [history, setHistory] = useState<PushRecord[]>([]);
  const userId = useSelector((state: RootState) => state.user.userId);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response: any = await getPushHistory(userId, 'health_tip', 10);
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

  const handlePush = async () => {
    setLoading(true);
    try {
      const response: any = await pushHealthTip(userId);
      if (response.status === 'success') {
        setLatestContent(response.content);
        message.success('推送成功！');
        loadHistory();
      }
    } catch (error: any) {
      message.error(error.response?.data?.detail || '推送失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={2}>
        <HeartOutlined /> 养生妙招
      </Title>
      <Paragraph type="secondary">
        系统会在每天下午14:00自动推送个性化养生小妙招
      </Paragraph>

      <Card title="获取养生妙招" style={{ marginBottom: 24 }}>
        <Button
          type="primary"
          size="large"
          icon={<HeartOutlined />}
          loading={loading}
          onClick={handlePush}
        >
          💡 获取今日养生妙招
        </Button>
        <div style={{ marginTop: 12, color: '#8c8c8c' }}>
          💡 每天都会根据您的健康档案推送定制化的养生建议
        </div>
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
            background: '#fff0f6', 
            borderRadius: 8,
            border: '1px solid #ffadd2' 
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

export default HealthTipPage;





