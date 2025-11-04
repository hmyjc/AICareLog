import React from 'react';
import { Layout as AntLayout, Menu } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  UserOutlined,
  SmileOutlined,
  ClockCircleOutlined,
  CoffeeOutlined,
  CloudOutlined,
  HeartOutlined,
} from '@ant-design/icons';

const { Header, Content, Sider } = AntLayout;

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '用户档案',
    },
    {
      key: 'persona',
      icon: <SmileOutlined />,
      label: '人物风格',
    },
    {
      key: 'rest',
      icon: <ClockCircleOutlined />,
      label: '作息提醒',
    },
    {
      key: 'meal',
      icon: <CoffeeOutlined />,
      label: '饮食提醒',
    },
    {
      key: 'weather',
      icon: <CloudOutlined />,
      label: '天气推送',
    },
    {
      key: 'health-tip',
      icon: <HeartOutlined />,
      label: '养生妙招',
    },
  ];

  const handleMenuClick = (e: any) => {
    navigate(`/${e.key}`);
  };

  const selectedKey = location.pathname.split('/')[1] || 'profile';

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#fff', 
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
      }}>
        <div style={{ 
          fontSize: '20px', 
          fontWeight: 'bold',
          color: '#1890ff',
        }}>
          🏥 健康档案助手
        </div>
      </Header>
      <AntLayout>
        <Sider 
          width={200} 
          style={{ background: '#fff' }}
          breakpoint="lg"
          collapsedWidth="0"
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ height: '100%', borderRight: 0 }}
          />
        </Sider>
        <AntLayout style={{ padding: '24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: '#fff',
              borderRadius: '8px',
            }}
          >
            <Outlet />
          </Content>
        </AntLayout>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;



