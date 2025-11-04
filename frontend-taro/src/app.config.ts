export default {
  pages: [
    'pages/profile/index',
    'pages/persona/index',
    'pages/rest/index',
    'pages/meal/index',
    'pages/weather/index',
    'pages/health-tip/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '健康档案助手',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#666',
    selectedColor: '#1890ff',
    backgroundColor: '#fff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/profile/index',
        text: '档案'
      },
      {
        pagePath: 'pages/rest/index',
        text: '作息'
      },
      {
        pagePath: 'pages/meal/index',
        text: '饮食'
      },
      {
        pagePath: 'pages/weather/index',
        text: '天气'
      },
      {
        pagePath: 'pages/health-tip/index',
        text: '养生'
      }
    ]
  }
}

