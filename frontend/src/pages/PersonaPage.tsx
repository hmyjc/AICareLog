import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, message, Typography, Tag, Space, Modal } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setHasPersona, setCurrentPersona } from '../store/userSlice';
import { 
  getPersonaStyles, 
  selectPersonaStyle, 
  getCurrentPersonaStyle,
  getHealthProfile 
} from '../services/api';

const { Title, Paragraph } = Typography;

interface PersonaStyle {
  style_name: string;
  description: string;
  icon: string;
}

const PersonaPage: React.FC = () => {
  const [styles, setStyles] = useState<PersonaStyle[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasProfile, setHasProfileState] = useState(false);
  const userId = useSelector((state: RootState) => state.user.userId);
  const dispatch = useDispatch();

  useEffect(() => {
    checkProfile();
    loadPersonaStyles();
    loadCurrentStyle();
  }, []);

  const checkProfile = async () => {
    try {
      await getHealthProfile(userId);
      setHasProfileState(true);
    } catch (error) {
      setHasProfileState(false);
    }
  };

  const loadPersonaStyles = async () => {
    try {
      const response: any = await getPersonaStyles();
      if (response.status === 'success') {
        setStyles(response.data);
      }
    } catch (error) {
      message.error('加载人物风格失败');
    }
  };

  const loadCurrentStyle = async () => {
    try {
      const response: any = await getCurrentPersonaStyle(userId);
      if (response.status === 'success' && response.data) {
        setSelectedStyle(response.data.style_name);
        dispatch(setCurrentPersona(response.data.style_name));
        dispatch(setHasPersona(true));
      }
    } catch (error) {
      // 用户尚未选择风格
    }
  };

  const handleSelectStyle = async (styleName: string) => {
    if (!hasProfile) {
      Modal.warning({
        title: '提示',
        content: '请先完成用户档案填写，再选择风格',
        okText: '知道了',
      });
      return;
    }

    setLoading(true);
    try {
      await selectPersonaStyle(userId, styleName);
      setSelectedStyle(styleName);
      dispatch(setCurrentPersona(styleName));
      dispatch(setHasPersona(true));
      message.success(`成功选择"${styleName}"风格！`);
    } catch (error: any) {
      message.error(error.response?.data?.detail || '选择风格失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={2}>选择人物风格</Title>
      <Paragraph type="secondary">
        选择一个您喜欢的推送人物风格，让健康资讯推送更具情感温度
      </Paragraph>

      {!hasProfile && (
        <div style={{ 
          padding: 16, 
          background: '#fff7e6', 
          border: '1px solid #ffd591',
          borderRadius: 4,
          marginBottom: 24 
        }}>
          <Space>
            <span style={{ color: '#fa8c16' }}>⚠️</span>
            <span>请先完成用户档案填写，再选择人物风格</span>
          </Space>
        </div>
      )}

      <Row gutter={[16, 16]}>
        {styles.map((style) => (
          <Col xs={24} sm={12} md={8} lg={6} key={style.style_name}>
            <Card
              hoverable
              style={{
                border: selectedStyle === style.style_name ? '2px solid #1890ff' : '1px solid #d9d9d9',
                position: 'relative',
              }}
              bodyStyle={{ padding: 16 }}
              onClick={() => handleSelectStyle(style.style_name)}
            >
              {selectedStyle === style.style_name && (
                <CheckCircleFilled
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    color: '#1890ff',
                    fontSize: 24,
                  }}
                />
              )}
              
              <div style={{ textAlign: 'center', marginBottom: 12 }}>
                <div style={{ fontSize: 48 }}>{style.icon}</div>
              </div>
              
              <Title level={4} style={{ textAlign: 'center', marginBottom: 8 }}>
                {style.style_name}
              </Title>
              
              <Paragraph 
                style={{ 
                  textAlign: 'center', 
                  marginBottom: 12,
                  minHeight: 60,
                  fontSize: 13,
                  color: '#666'
                }}
              >
                {style.description}
              </Paragraph>
              
              {selectedStyle === style.style_name && (
                <Tag color="blue" style={{ width: '100%', textAlign: 'center' }}>
                  当前选择
                </Tag>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      {selectedStyle && (
        <div style={{ 
          marginTop: 24, 
          padding: 16, 
          background: '#f6ffed', 
          border: '1px solid #b7eb8f',
          borderRadius: 4 
        }}>
          <Space>
            <CheckCircleFilled style={{ color: '#52c41a' }} />
            <span>当前选择：<strong>{selectedStyle}</strong> 风格</span>
          </Space>
        </div>
      )}
    </div>
  );
};

export default PersonaPage;





