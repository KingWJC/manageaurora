const iconList = (_self) => {
  return [
    {
      name: '交易中心',
      source: 'icon-al-jiaoyi',
      color: '',
    },
    {
      name: '产品中心',
      source: 'icon-al-chanpinku',
    },
    {
      name: '组织人员',
      source: 'icon-al-zuzhiguanli',
    },
    {
      name: '资料服务',
      source: 'icon-al-ziliao',
    },
    {
      name: '物流服务',
      source: 'icon-al-wuliuxinxi',
    },
    {
      name: '客户服务',
      source: 'icon-al-kehufuwu',
    },
    {
      name: '文件',
      source: 'icon-al-wenjian',
    },
    {
      name: '红包',
      source: 'icon-al-hongbao1',
      color: '#ff0000',
      click: () => {
        _self.$router.push({
          path: '/main/hairRedPacket',
        })
      },
    },
  ]
};

const headerData = (_self, name, /*userId, groupId*/) => {
  return {
    centerText: {
      title: name,
      click: () => { },
    },
    leftIcons: [
      {
        iName: 'icon-al-right-angle',
        type: 'icon',
        click: () => {
          // _self.API.send(_self.CFG.services.im.popView, { }, function () {
          // }, function () { }, _self)
          _self.$routerHistory.goBack(_self);
        },
      },
    ],
    rightIcons: [
      /*
      {
        iName: 'icon-al-shenglve',
        type: 'icon',
        click: () => {
          console.log(name, userId, groupId)
          if(groupId) {
            // 去群资料页
            _self.$router.push({
              path: '/main/groupInfo',
              query: {
                groupId
              },
            })
          } else if(userId) {
            // 去个人资料页
            _self.$router.push({
              path: '/main/singleInfo',
              query: {
                userId,
                readOnly: 'true'
              },
            })
          }
        },
      },
      */
      /*
      {
        iName: 'icon-al-dianhua',
        type: 'icon',
        click: () => {
          console.log('语音通话')
        },
      },
      */
    ],
  };
}
export {
  iconList,
  headerData,
}