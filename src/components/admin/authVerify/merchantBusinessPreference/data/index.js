/*
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2025-09-21 13:04:19
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-09-21 13:04:19
 * @FilePath: /manageaurora/src/components/admin/authVerify/merchantBusinessPreference/data/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { renderOptionLabel } from '@/common-base/components/commonForm/utils/renderUtils';
/**
 * 单据列及单据卡片
 */
import {
  AUDIT_CARD_COLS,
  AUDIT_CARD_ADJUST_COLS,
  AUDIT_TYPE_COL,
  AUDIT_TYPE_SEARCH_COL,
  AUDIT_CARD,
  disabledModifyStopApply,
} from '@/common-base/components/commonForm/data/auditData';

const SHOW_IN_NEARBY_LIST_OPTIONS = [
  { label: '显示', value: 1 },
  { label: '禁用', value: 0 },
];

const MERCHANT_CATEGORY_OPTIONS = [
  { label: '私域商城', value: '1' },
  { label: '云药房', value: '2' },
  { label: '云诊室', value: '3' },
  { label: '药发采', value: '4' },
  { label: '云氧疗', value: '5' },
  { label: '云药房S', value: '6' },
  { label: '逆时舱', value: '7' },
];

function getMerchantTypeList(context) {
  return new Promise((resolve, reject) => {
    context.API.send(context.CFG.services.ca.shopTypeList, {}, (res) => {
      const data = res.serviceResult.rows || [];
      resolve(data);
    }, () => {
      reject()
    }, context);
  });
}

/**
     * 转换中文名称
     */
function getShopTypeName(code){
  let str = '';
  switch(code)
    {
      case '001':
        str = '诊所'
        break;
      case  '002':
        str = '药店'
        break;
      case '003':
        str = '网红'
        break;
      case  '004':
        str = '专家'
        break;
    }
  return str
}

/**
 * 组件 API 配置
 */
const COMPONENT_API_CONFIG = {
  module: 'ca', // 模块名称
  applyList: 'merchantBusinessPreferencePageApply', // 单据列表 API
  applyCreate: 'merchantBusinessPreferenceUpdate', // 单据创建 API
  applyUpdate: 'merchantBusinessPreferenceUpdate', // 单据更新 API
  applyDelete: 'merchantBusinessPreferenceDelete', // 单据删除 API
  applyAudit: 'merchantBusinessPreferenceAudit', // 单据审核 API
  applyDetail: 'merchantBusinessPreferenceView', // 单据详情 API
  list: 'merchantBusinessPreferencePageResult', // 结果集列表 API
  detail: 'merchantBusinessPreferenceGetResultByMerchantId', // 结果集详情 API
  listDirective: 'merchantBusinessPreferencePageDirective',
};

/**
 * 组件列
 */
const COMPONENT_COLS = [
  {
    label: '商户',
    id: 'merchantName',
    width: '150',
    type: 'text',
    maxlength: 100,
    searchable: true,
    listable: true,
    editable: false,
  },
  {
    label: '商户',
    id: 'merchantId',
    width: '150',
    required: true,
    listable: false,
    editable: true,
    disabled: (context) => disabledModifyStopApply(context),
    type: 'selectTableDialog',
    field: {
      labelRenderer: (row) => row.merchantName
    },
    selectTable: {
      onClick: async (context, type) => {
        try {
          const MERCHANT_TYPE_OPTIONS = await getMerchantTypeList(context);
          context.$emit('selectTableShow', {
            title: '选择商户',
            apiModule: 'ca',
            apiKey: 'shopList',
            rowKey: 'id',
            params: { status: '1' },
            cols: [
              {
                label: 'ID',
                id: 'id',
                width: '150',
                type: 'text',
                listable: true,
                searchable: false,
              },
              {
                label: '名称',
                id: 'name',
                width: '150',
                type: 'text',
                listable: true,
                searchable: true,
              },
              {
                label: '类型',
                id: 'shopType',
                width: '150',
                type: 'select',
                listable: true,
                searchable: true,
                field: {
                  labelKey: 'name',
                  valueKey: 'code',
                  options: MERCHANT_TYPE_OPTIONS,
                },
                render: (row) => {
                  return getShopTypeName(row.shopType);
                },
              },
              {
                label: '分类',
                id: 'category',
                width: '150',
                type: 'select',
                listable: true,
                searchable: true,
                field: {
                  labelKey: 'label',
                  valueKey: 'value',
                  options: MERCHANT_CATEGORY_OPTIONS,
                },
                render: (row) => {
                  return renderOptionLabel({
                    row,
                    options: MERCHANT_CATEGORY_OPTIONS,
                    field: 'category'
                  });
                },
              },
            ],
            type,
            onConfirm: (item, context) => {
              context.formData = {
                ...context.formData,
                merchantId: item.id,
                merchantName: item.name,
              };
            }
          });
        } catch (error) {
          console.log(error)
        }

      }
    },
    render: row => row.merchantName || row.merchantId,
  },
  {
    label: '客户附近列表',
    id: 'showInNearbyList',
    width: '150',
    type: 'radio',
    listable: true,
    editable: true,
    required: true,
    field: {
      labelKey: 'label',
      valueKey: 'value',
      options: SHOW_IN_NEARBY_LIST_OPTIONS,
    },
    render: (row) => {
      return renderOptionLabel({
        row,
        options: SHOW_IN_NEARBY_LIST_OPTIONS,
        field: 'showInNearbyList'
      });
    },
  },
  //单据卡片列表
  ...AUDIT_CARD_COLS,
  ...AUDIT_CARD_ADJUST_COLS,
];

/**
 * 详情页搜索查询
 */
const DETAIL_SEARCH_CARD_CONFIG = {
  title: '查询商户经营偏好', // 标题
  cols: COMPONENT_COLS, // 列
  apiModule: COMPONENT_API_CONFIG.module, // apiModule
  apiKey: COMPONENT_API_CONFIG.list, // apiKey
  params: { status: '1' }, // 搜索查询参数
  cardTitlePrefix: '', // 搜索条目卡片标题
  cardTitleKey: '' // 搜索条目卡片标题 Key
};

/**
 * 组件配置
 */
const COMPONENT_CONFIG = {
  // 组件 API 信息
  ...COMPONENT_API_CONFIG,
  resultId: 'businessPreferenceId',
  oss: {}, // 组件 oss
  detailPageTitle: {
    create: '商户经营偏好申请单',
    modify: '商户经营偏好修改单',
    stop: '商户经营偏好作废单',
    adjust: "商户经营偏好待生效数据调整单",
  },
  // 详情页搜索查询卡片
  detailSearchCard: {
    modify: DETAIL_SEARCH_CARD_CONFIG,
    stop: DETAIL_SEARCH_CARD_CONFIG,
    adjust: {
      ...DETAIL_SEARCH_CARD_CONFIG,
      title: '查询商户经营偏好单据',
      params: {},
      apiKey: COMPONENT_API_CONFIG.listDirective,
      cols: [
        ...DETAIL_SEARCH_CARD_CONFIG.cols,
        AUDIT_TYPE_COL,
        AUDIT_TYPE_SEARCH_COL,
      ]
    },
  },
  cols: COMPONENT_COLS, // 组件列信息
  /**
   * 详情页卡片
   */
  detailCards: [
    {
      title: '基本信息',
      ref: 'BasicInfoRef',
      cols: ['merchantId', 'showInNearbyList']
    },
    //单据卡片
    {
      ...AUDIT_CARD,
      cols: ['source', 'effectType', 'effectTime', 'formRemark']
    },
  ]
};

/**
 * 导出组件配置
 */
export { COMPONENT_CONFIG };
