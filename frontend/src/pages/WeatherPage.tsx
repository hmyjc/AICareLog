import React, { useState, useEffect } from 'react';
import { Card, Button, List, Typography, Space, message, Tag, Empty, Select, Form } from 'antd';
import { CloudOutlined, ReloadOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { pushWeatherReminder, getPushHistory, setUserLocation, getHealthProfile } from '../services/api';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

interface PushRecord {
  _id: string;
  content: string;
  push_time: string;
  is_read: boolean;
}

const WeatherPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [latestContent, setLatestContent] = useState<string>('');
  const [history, setHistory] = useState<PushRecord[]>([]);
  const [locationSet, setLocationSet] = useState(false);
  const [form] = Form.useForm();
  const userId = useSelector((state: RootState) => state.user.userId);

  // 完整的城市数据（根据中国天气网数据）
  const cityData: Record<string, string[]> = {
    '北京': ['北京'],
    '上海': ['上海'],
    '天津': ['天津'],
    '重庆': ['重庆'],
    '内蒙古': ['呼和浩特', '包头', '乌海', '赤峰', '通辽', '鄂尔多斯', '呼伦贝尔', '巴彦淖尔', '乌兰察布', '兴安盟', '锡林郭勒盟', '阿拉善盟'],
    '辽宁': ['沈阳', '大连', '鞍山', '抚顺', '本溪', '丹东', '锦州', '营口', '阜新', '辽阳', '盘锦', '铁岭', '朝阳', '葫芦岛'],
    '吉林': ['长春', '吉林', '四平', '辽源', '通化', '白山', '松原', '白城', '延边州'],
    '黑龙江': ['哈尔滨', '齐齐哈尔', '鸡西', '鹤岗', '双鸭山', '大庆', '伊春', '佳木斯', '七台河', '牡丹江', '黑河', '绥化', '大兴安岭'],
    '河北': ['石家庄', '唐山', '秦皇岛', '邯郸', '邢台', '保定', '张家口', '承德', '沧州', '廊坊', '衡水'],
    '山西': ['太原', '大同', '阳泉', '长治', '晋城', '朔州', '晋中', '运城', '忻州', '临汾', '吕梁'],
    '陕西': ['西安', '铜川', '宝鸡', '咸阳', '渭南', '延安', '汉中', '榆林', '安康', '商洛'],
    '山东': ['济南', '青岛', '淄博', '枣庄', '东营', '烟台', '潍坊', '济宁', '泰安', '威海', '日照', '临沂', '德州', '聊城', '滨州', '菏泽'],
    '新疆': ['乌鲁木齐', '克拉玛依', '吐鲁番', '哈密', '昌吉州', '博尔塔拉', '巴音郭楞', '阿克苏', '克孜勒苏柯尔克孜', '喀什', '和田', '伊犁', '塔城', '阿勒泰', '石河子', '阿拉尔', '图木舒克', '五家渠', '北屯', '铁门关', '双河', '可克达拉', '昆玉'],
    '甘肃': ['兰州', '嘉峪关', '金昌', '白银', '天水', '武威', '张掖', '平凉', '酒泉', '庆阳', '定西', '陇南', '临夏州', '甘南州'],
    '青海': ['西宁', '海东', '海北州', '黄南州', '海南州', '果洛州', '玉树州', '海西州'],
    '宁夏': ['银川', '石嘴山', '吴忠', '固原', '中卫'],
    '河南': ['郑州', '开封', '洛阳', '平顶山', '安阳', '鹤壁', '新乡', '焦作', '濮阳', '许昌', '漯河', '三门峡', '南阳', '商丘', '信阳', '周口', '驻马店', '济源'],
    '江苏': ['南京', '无锡', '徐州', '常州', '苏州', '南通', '连云港', '淮安', '盐城', '扬州', '镇江', '泰州', '宿迁'],
    '湖北': ['武汉', '黄石', '十堰', '宜昌', '襄阳', '鄂州', '荆门', '孝感', '荆州', '黄冈', '咸宁', '随州', '恩施州', '仙桃', '潜江', '天门', '神农架'],
    '浙江': ['杭州', '宁波', '温州', '嘉兴', '湖州', '绍兴', '金华', '衢州', '舟山', '台州', '丽水'],
    '安徽': ['合肥', '芜湖', '蚌埠', '淮南', '马鞍山', '淮北', '铜陵', '安庆', '黄山', '滁州', '阜阳', '宿州', '六安', '亳州', '池州', '宣城'],
    '福建': ['福州', '厦门', '莆田', '三明', '泉州', '漳州', '南平', '龙岩', '宁德'],
    '江西': ['南昌', '景德镇', '萍乡', '九江', '新余', '鹰潭', '赣州', '吉安', '宜春', '抚州', '上饶'],
    '湖南': ['长沙', '株洲', '湘潭', '衡阳', '邵阳', '岳阳', '常德', '张家界', '益阳', '郴州', '永州', '怀化', '娄底', '湘西州'],
    '四川': ['成都', '自贡', '攀枝花', '泸州', '德阳', '绵阳', '广元', '遂宁', '内江', '乐山', '南充', '眉山', '宜宾', '广安', '达州', '雅安', '巴中', '资阳', '阿坝州', '甘孜州', '凉山州'],
    '贵州': ['贵阳', '六盘水', '遵义', '安顺', '毕节', '铜仁', '黔西南州', '黔东南州', '黔南州'],
    '广东': ['广州', '韶关', '深圳', '珠海', '汕头', '佛山', '江门', '湛江', '茂名', '肇庆', '惠州', '梅州', '汕尾', '河源', '阳江', '清远', '东莞', '中山', '潮州', '揭阳', '云浮'],
    '广西': ['南宁', '柳州', '桂林', '梧州', '北海', '防城港', '钦州', '贵港', '玉林', '百色', '贺州', '河池', '来宾', '崇左'],
    '云南': ['昆明', '曲靖', '玉溪', '保山', '昭通', '丽江', '普洱', '临沧', '楚雄州', '红河州', '文山州', '西双版纳', '大理州', '德宏州', '怒江州', '迪庆州'],
    '西藏': ['拉萨', '日喀则', '昌都', '林芝', '山南', '那曲', '阿里'],
    '海南': ['海口', '三亚', '三沙', '儋州'],
    '台湾': ['台北', '高雄', '台中'],
  };

  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    loadUserProfile();
    loadHistory();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response: any = await getHealthProfile(userId);
      if (response.status === 'success' && response.data.location) {
        const { province, city } = response.data.location;
        // 设置省份和城市
        form.setFieldsValue({ province, city });
        // 更新城市列表
        setCities(cityData[province] || []);
        setLocationSet(true);
      }
    } catch (error) {
      console.error('加载用户档案失败:', error);
    }
  };

  const loadHistory = async () => {
    try {
      const response: any = await getPushHistory(userId, 'weather', 10);
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

  const handleProvinceChange = (province: string) => {
    setCities(cityData[province] || []);
    form.setFieldValue('city', undefined);
  };

  const handleSetLocation = async (values: any) => {
    try {
      await setUserLocation(userId, values);
      setLocationSet(true);
      message.success('地区设置成功！');
    } catch (error: any) {
      message.error(error.response?.data?.detail || '设置失败');
    }
  };

  const handlePush = async () => {
    if (!locationSet) {
      message.warning('请先设置所在地区');
      return;
    }

    setLoading(true);
    try {
      const response: any = await pushWeatherReminder(userId);
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
        <CloudOutlined /> 天气推送
      </Title>
      <Paragraph type="secondary">
        系统会在每天早上7:00自动推送天气信息和健康建议
      </Paragraph>

      <Card title={<><EnvironmentOutlined /> 设置所在地区</>} style={{ marginBottom: 24 }}>
        <Form form={form} layout="inline" onFinish={handleSetLocation}>
          <Form.Item 
            name="province" 
            rules={[{ required: true, message: '请选择省份' }]}
          >
            <Select 
              placeholder="选择省份" 
              style={{ width: 150 }}
              onChange={handleProvinceChange}
            >
              {Object.keys(cityData).map(province => (
                <Option key={province} value={province}>{province}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item 
            name="city" 
            rules={[{ required: true, message: '请选择城市' }]}
          >
            <Select placeholder="选择城市" style={{ width: 150 }}>
              {cities.map(city => (
                <Option key={city} value={city}>{city}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              保存地区
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="获取天气推送" style={{ marginBottom: 24 }}>
        <Button
          type="primary"
          size="large"
          icon={<CloudOutlined />}
          loading={loading}
          onClick={handlePush}
        >
          获取今日天气
        </Button>
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
            background: '#e6f7ff', 
            borderRadius: 8,
            border: '1px solid #91d5ff',
            whiteSpace: 'pre-wrap'
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
                  description={
                    <div style={{ whiteSpace: 'pre-wrap' }}>{item.content}</div>
                  }
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

export default WeatherPage;


