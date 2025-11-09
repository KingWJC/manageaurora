// 要降级的errorCode
const errorCodes = [
    // 云管家S
    'WINygj0001000001',
    'IOSygj0001000001',
    'ANDygj0001000001',
    'MACygj0001000001',
    // 朗致云服
    'WINlyf0001000001',
    'IOSlyf0001000001',
    'ANDlyf0001000001',
    'MAClyf0001000001',
    // 朗致智云
    'WINlzy0001000001',
    'IOSlzy0001000001',
    'ANDlzy0001000001',
    'MAClzy0001000001',
    // 第二药房S
    'WINsps0001000001',
    'IOSsps0001000001',
    'ANDsps0001000001',
    'MACsps0001000001',
    // 朗致商业三方同步
    'WINlsc0001000001',
    'IOSlsc0001000001',
    'ANDlsc0001000001',
    'MAClsc0001000001',
    // 微问诊
    'WINwwz0001000001',
    'IOSwwz0001000001',
    'ANDwwz0001000001',
    'MACwwz0001000001',
    // 朗致销客
    'WINlxk0001000001',
    'IOSlxk0001000001',
    'ANDlxk0001000001',
    'MAClxk0001000001',
    // 药发采
    'WINyfc0001000001',
    'IOSyfc0001000001',
    'ANDyfc0001000001',
    'MACyfc0001000001',
    // 朗致医保
    'WINlyb0001000001',
    'IOSlyb0001000001',
    'ANDlyb0001000001',
    'MAClyb0001000001',
    // 云问诊
    'WINywz0001000001',
    'IOSywz0001000001',
    'ANDywz0001000001',
    'MACywz0001000001',
    // 云诊室S
    'WINyzs0001000001',
    'IOSyzs0001000001',
    'ANDyzs0001000001',
    'MACyzs0001000001',
    'WEBSERYZS0000000101',  // 正常业务验重校验，无需处理
    'WEBSERYZS0000000102',  // 正常业务验重校验，无需处理
    'WEBSERORG0000000011',  // 正常业务验重校验，无需处理
    'WEBSERYZS0000000116',  // 正常业务验重校验，无需处理
    'WEBSERYZS0000000117',  // 正常业务验重校验，无需处理
    'WEBSERYZS0000000096',  // 正常业务验重校验，无需处理
    'WEBSERORG0000000007',  // 正常业务验重校验，无需处理
    // 第二商城
    'WINlsm0001000001',
    'IOSlsm0001000001',
    'ANDlsm0001000001',
    'MAClsm0001000001',
    // 致医优氧
    'WINzyy0001000001',
    'IOSzyy0001000001',
    'ANDzyy0001000001',
    'MACzyy0001000001',
    // 智能设备控制系统
    'WINice0001000001',
    'IOSice0001000001',
    'ANDice0001000001',
    'MACice0001000001',
    // 云屏S
    'WINyps0001000001',
    'IOSyps0001000001',
    'ANDyps0001000001',
    'MACyps0001000001',
    // NC校验库不足
    'SERsia0000000060',
    // 分页报表正常校验报错，无需处理
    'SERxpt0000000005',
    'SERxpt0000000010',
    'SERxpt0000000014',
    'SERxpt0000000016',
    'SERxpt0000000017',
    'SERxpt0000000018',
    'SERxpt0000000019',
    'SERxpt0000000020',
    'SERxpt0000000021',
    'SERxpt0000000022',
    'SERxpt0000000039',
    'SERxpt0000000046',
    'SERxpt0000000066',
    'SERxpt0000000067',
    'SERxpt0000000068',
    'SERxpt0000000069',
    // 云服正常业务校验
    'SERsku0000000018',
    'SERoem0000000019',
    // 原推荐人与推荐人不相同时，关系生效时间为必填项，且须要大于当前时间！ ！
    'SERRRM1000000001',
    'SERMAP1000100001',
];

export default class AdjustErrorLevel {
    status2warn(data, level) {
        if(data && (data.code || data.errorCode) && errorCodes.includes(data.code || data.errorCode)) {
            return 'warn';
        } else {
            return level;
        }
    }
}