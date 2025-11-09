/**
 * 签署方
 */
export const numberList = () => {
  let arr =  [
    { c: 2,n: '二方合同'},
    { c: 3,n: '三方合同'},
    { c: 4,n: '四方合同'},
    { c: 5,n: '五方合同'},
    { c: 6,n: '六方合同'},
    { c: 7,n: '七方合同'},
    { c: 8,n: '八方合同'},
    { c: 9,n: '九方合同'},
    { c: 10,n: '十方合同'},
    { c: 11,n: '十一方合同'},
    { c: 12,n: '十二方合同'},
    { c: 13,n: '十三方合同'},
    { c: 14,n: '十四方合同'},
    { c: 15,n: '十五方合同'},
    { c: 16,n: '十六方合同'},
    { c: 17,n: '十七方合同'},
    { c: 18,n: '十八方合同'},
    { c: 19,n: '十九方合同'},
    { c: 20,n: '二十方合同'},
    { c: 21,n: '二十一方合同'},
    { c: 22,n: '二十二方合同'},
    { c: 23,n: '二十三方合同'},
    { c: 24,n: '二十四方合同'},
    { c: 25,n: '二十五方合同'},
    { c: 26,n: '二十六方合同'},
    { c: 27,n: '二十七方合同'},
    { c: 28,n: '二十八方合同'},
    { c: 29,n: '二十九方合同'},
    { c: 30,n: '三十方合同'},
    { c: 31,n: '三十一方合同'},
    { c: 32,n: '三十二方合同'},
    { c: 33,n: '三十三方合同'},
    { c: 34,n: '三十四方合同'},
    { c: 35,n: '三十五方合同'},
    { c: 36,n: '三十六方合同'},
    { c: 37,n: '三十七方合同'},
    { c: 38,n: '三十八方合同'},
    { c: 39,n: '三十九方合同'},
    { c: 40,n: '四十方合同'},
    { c: 41,n: '四十一方合同'},
    { c: 42,n: '四十二方合同'},
    { c: 43,n: '四十三方合同'},
    { c: 44,n: '四十四方合同'},
    { c: 45,n: '四十五方合同'},
    { c: 46,n: '四十六方合同'},
    { c: 47,n: '四十七方合同'},
    { c: 48,n: '四十八方合同'},
    { c: 49,n: '四十九方合同'},
    { c: 50,n: '五十方合同'},
    { c: 51,n: '五十一方合同'},
    { c: 52,n: '五十二方合同'},
    { c: 53,n: '五十三方合同'},
    { c: 54,n: '五十四方合同'},
    { c: 55,n: '五十五方合同'},
    { c: 56,n: '五十六方合同'},
    { c: 57,n: '五十七方合同'},
    { c: 58,n: '五十八方合同'},
    { c: 59,n: '五十九方合同'},
    { c: 60,n: '六十方合同'}
  ]
  return arr
}
/**
 * 合同方转中文
 */
export const toChinese = (val) => {
  let str = '';
  switch(val+1){
    case 1:
      str = '甲方';
      break;
    case 2:
      str = '乙方';
      break;
    case 3:
      str = '丙方';
      break;
    case 4:
      str = '丁方';
    break;
    case 5:
      str = '第五方';
    break;
    case 6:
      str = '第六方';
    break;
    case 7:
      str = '第七方';
    break;
    case 8:
      str = '第八方';
    break;
    case 9:
      str = '第九方';
    break;
    case 10:
      str = '第十方';
    break;
    case 11:
      str = '第十一方';
      break;
    case 12:
      str = '第十二方';
      break;
    case 13:
      str = '第十三方';
      break;
    case 14:
      str = '第十四方';
    break;
    case 15:
      str = '第十五方';
    break;
    case 16:
      str = '第十六方';
    break;
    case 17:
      str = '第十七方';
    break;
    case 18:
      str = '第十八方';
    break;
    case 19:
      str = '第十九方';
    break;
    case 20:
      str = '第二十方';
    break;
    case 21:
      str = '第二十一方';
      break;
    case 22:
      str = '第二十二方';
      break;
    case 23:
      str = '第二十三方';
      break;
    case 24:
      str = '第二十四方';
    break;
    case 25:
      str = '第二十五方';
    break;
    case 26:
      str = '第二十六方';
    break;
    case 27:
      str = '第二十七方';
    break;
    case 28:
      str = '第二十八方';
    break;
    case 29:
      str = '第二十九方';
    break;
    case 30:
      str = '第三十方';
    break;
    case 31:
      str = '第三十一方';
      break;
    case 32:
      str = '第三十二方';
      break;
    case 33:
      str = '第三十三方';
      break;
    case 34:
      str = '第三十四方';
    break;
    case 35:
      str = '第三十五方';
    break;
    case 36:
      str = '第三十六方';
    break;
    case 37:
      str = '第三十七方';
    break;
    case 38:
      str = '第三十八方';
    break;
    case 39:
      str = '第三十九方';
    break;
    case 40:
      str = '第四十方';
    break;
    case 41:
      str = '第四十一方';
      break;
    case 42:
      str = '第四十二方';
      break;
    case 43:
      str = '第四十三方';
      break;
    case 44:
      str = '第四十四方';
    break;
    case 45:
      str = '第四十五方';
    break;
    case 46:
      str = '第四十六方';
    break;
    case 47:
      str = '第四十七方';
    break;
    case 48:
      str = '第四十八方';
    break;
    case 49:
      str = '第四十九方';
    break;
    case 50:
      str = '第五十方';
    break;
    case 51:
      str = '第五十一方';
      break;
    case 52:
      str = '第五十二方';
      break;
    case 53:
      str = '第五十三方';
      break;
    case 54:
      str = '第五十四方';
    break;
    case 55:
      str = '第五十五方';
    break;
    case 56:
      str = '第五十六方';
    break;
    case 57:
      str = '第五十七方';
    break;
    case 58:
      str = '第五十八方';
    break;
    case 59:
      str = '第五十九方';
    break;
    case 60:
      str = '第六十方';
    break;
    
  }
  return str
}
/**
 * 合同标的表格头
 */
export const cols = () => {
  let obj =  {
    '101': [
      { label: '主计量单位', prop: 'mainUnitValue'},
      { label: '规格', prop: 'specification'},
      { label: '包装规格', prop: 'packingSpecification'},

      { label: '生产企业', prop: 'manufacturerValue'},
      { label: '69码', prop: 'barcode'},
      { label: '批准文号', prop: 'licenseNumber'},
      { label: '处方分类', prop: 'rxTypeValue'},
      { label: '商标', prop: 'trademark'},
      { label: '有效期', prop: 'validPeriodValue'},
    ],
    '102': [
      { label: '主计量单位', prop: 'mainUnitValue'},
      { label: '商品类型', prop: 'productTypeValue'},
      { label: '医疗器械分类', prop: 'medicalDeviceTypeValue'},
      { label: '规格型号', prop: 'specificationAndModel'},
      { label: '包装规格', prop: 'packingSpecification'},

      { label: '注册证号/备案号', prop: 'licenseNumber'},
      { label: '生产企业', prop: 'manufacturerValue'},
      { label: '商品69码', prop: 'barcode'},
      { label: '商标', prop: 'trademark'},
      { label: '有效期', prop: 'validPeriodValue'},
    ],
    '103':[
     { label: '主计量单位', prop: 'mainUnitValue'},
      { label: '商品类型', prop: 'productTypeValue'},
      { label: '包装规格', prop: 'packingSpecification'},

      { label: '生产企业', prop: 'manufacturerValue'},
      { label: '商品69码', prop: 'barcode'},
      { label: '商标', prop: 'trademark'},
      { label: '有效期', prop: 'validPeriodValue'},
    ],
    '104':[
      { label: '主计量单位', prop: 'mainUnitValue'},
      { label: '商品类型', prop: 'productTypeValue'},
      { label: '剂型', prop: 'formulationValue'},
      { label: '规格', prop: 'specification'},
      { label: '包装规格', prop: 'packingSpecification'},

      { label: '注册证号/备案号', prop: 'licenseNumber'},
      { label: '生产企业', prop: 'manufacturerValue'},
      { label: '商品69码', prop: 'barcode'},
      { label: '商标', prop: 'trademark'},
      { label: '有效期', prop: 'validPeriodValue'},
    ],
    '105': [
      { label: '主计量单位', prop: 'mainUnitValue'},
      { label: '包装规格', prop: 'packingSpecification'},

      { label: '注册证号/备案号', prop: 'licenseNumber'},
      { label: '生产企业', prop: 'manufacturerValue'},
      { label: '商品69码', prop: 'barcode'},
      { label: '商标', prop: 'trademark'},
      { label: '有效期', prop: 'validPeriodValue'},
    ],
    '199': [
      { label: '主计量单位', prop: 'mainUnitValue'},
      { label: '商品类型', prop: 'productTypeValue'},
      { label: '规格', prop: 'specification'},
      { label: '型号', prop: 'model'},
      { label: '包装规格', prop: 'packingSpecification'},

      { label: '生产企业', prop: 'manufacturerValue'},
      { label: '商品69码', prop: 'barcode'},
      { label: '商标', prop: 'trademark'},
    ],
  '-1': [
      { label: '服务类型', prop: 'productTypeValue'},
      { label: '规格', prop: 'specification'},
      { label: '服务供应商', prop: 'supplierValue'},
      { label: '商品69码', prop: 'barcode'},
      { label: '商标', prop: 'trademark'},
    ],
    'service': [
      { label: '服务类型', prop: 'productTypeValue'},
      { label: '规格', prop: 'specification'},
      { label: '服务供应商', prop: 'supplierValue'},
      { label: '商品69码', prop: 'barcode'},
      { label: '商标', prop: 'trademark'},
    ]
  }
  return obj
}
/**
 * 合同标的类型
 */
export const colsName = () => {
  let obj =  {
      '101': '药品',
      '102': '器械',
      '103': '食品',
      '104': '消毒用品',
      '105': '化妆品',
      '199': '其他',
      '-1': '服务',
      'service': '服务',
  }
  return obj
}