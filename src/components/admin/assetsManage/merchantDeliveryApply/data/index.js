/*
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2025-03-30 14:28:21
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-04-02 16:50:15
 * @FilePath: /manageaurora/src/components/admin/assetsManage/merchantDeliveryApply/data/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { renderOptionLabel } from '@/common-base/components/commonForm/utils/renderUtils';
/**
 * 单据列及单据卡片
 */
import {
  AUDIT_CARD_COLS, AUDIT_CARD_ADJUST_COLS, AUDIT_CARD,
  AUDIT_TYPE_COL, AUDIT_TYPE_SEARCH_COL, disabledModifyStopApply,
} from '@/common-base/components/commonForm/data/auditData';
import { HUMAN_SELECT_TABLE_CONFIG, ORG_SELECT_TABLE_CONFIG } from '@/common-base/components/commonForm/data/selectTableConfigs';

/**
 * API Promise 封装
 */
function apiPromise(apiModule, apiKey, params, context) {
  return new Promise((resolve, reject) => {
    context.API.send(context.CFG.services[apiModule][apiKey], (params || {}), (res) => {
      resolve(res.data);
    }, (err) => { reject(err) }, context);
  }).catch(err => {
    console.error('API 请求失败:', err);
  });
}

/**
 * 获取商户信息
 */
function getMerchantInfo(subjectId, context) {
  context.API.send(context.CFG.services.ca.shopListNoPermission, {
    category: '5',
    subjectId,
    status: '1',
    current: 1,
    rowCount: 100,
  }, (res) => {
    const data = res.serviceResult.rows || [];
    context.options.MERCHANT_ID_OPTIONS = data;
    if (data.length > 0) {
      context.formData = {
        ...context.formData,
        merchantId: data[0].id,
        merchantName: data[0].name,
      }
    } else {
      context.formData = {
        ...context.formData,
        merchantId: undefined,
        merchantName: undefined,
      }
    }
  }, () => {
  }, context);
}

/**
 * 获取收货方负责人信息
 */
function getConsigneeLinkmanList(orgId, context) {
  context.API.send(context.CFG.services.ca.linkmanListWithoutPermission, {
    orgId,
    current: 1,
    rowCount: 100,
    linkmanType: '2c06094c0ccd11f08d1cb8599feb8d24', // 机构负责人类型 ID
  }, (res) => {
    const data = res.serviceResult.rows || [];
    context.$set(context.formData, 'consigneeLinkmanList', data);
  }, () => {
  }, context);
}

/**
 * 获取资产列表详情信息
 */
function getAssetList(context) {
  if (context.formData.assetList?.length) {
    const assetIds = context.formData.assetList.map(asset => asset.assetId).join(',');
    context.API.send(context.CFG.services.oot.queryObjects, { ids: assetIds }, (res) => {
      const data = res.data || [];
      const assetList = context.formData.assetList || [];
      const newAssetList = assetList.map(asset => {
        const assetDetail = data[asset.assetId] || {};
        return {
          ...asset,
          ...assetDetail,
        };
      });
      context.formData.assetList = newAssetList;
    }, () => {
    }, context);
  }
}

/**
 * 组件 API 配置
 */
const COMPONENT_API_CONFIG = {
  module: 'da', // 模块名称
  applyList: 'merchantDeliveryApplyList', // 单据列表 API
  applyCreate: 'merchantDeliveryApplyUpdate', // 单据创建 API
  applyUpdate: 'merchantDeliveryApplyUpdate', // 单据更新 API
  applyDelete: 'merchantDeliveryApplyDelete', // 单据删除 API
  applyAudit: 'merchantDeliveryApplyAudit', // 单据审核 API
  applyDetail: 'merchantDeliveryApplyView', // 单据详情 API
  list: 'merchantDeliveryList', // 结果集列表 API
  detail: 'merchantDeliveryView', // 结果集详情 API
  listDirective: 'merchantDeliveryApplyListDirective', // 调整单列表 API
  detailDirective: 'merchantDeliveryApplyViewDirective' // 调整单详情 API
};
/**
 * 常量:
 * 发货人类型
 * 收货人类型
 */
const OWNER_TYPE_OPTIONS = [
  { label: '自然人', value: '1' },
  { label: '机构', value: '2' },
];

/**
 * 省市县, 详细地址列
 */
const ADDRESS_COLS = [
  {
    label: '省市县',
    id: 'addressProvinceCityDistrict',
    type: 'row',
    required: true,
    editable: true,
    listable: false,
    children: [
      {
        id: 'provinceCode',
        width: '150',
        type: 'select',
        required: true,
        placeholder: '请选择省',
        field: {
          labelKey: 'n',
          valueKey: 'c',
          options: vue.getCommonDictionary('area').filter(ad => ad.p === ''),
        },
        onChange: (_, context) => {
          context.$emit('update:formData', {
            ...context.formData,
            cityCode: undefined, // 清空市
            districtCode: undefined, // 清空县
          });
        }
      },
      {
        id: 'cityCode',
        width: '150',
        type: 'select',
        required: true,
        placeholder: '请选择市',
        field: {
          labelKey: 'n',
          valueKey: 'c',
          options: 'CITY_CODE_OPTIONS',
          optionsFilter: (_, context) => vue.getCommonDictionary('area').filter(ad => ad.p === context.formData.provinceCode),
        },
        onChange: (value, context) => {
          context.$emit('update:formData', {
          ...context.formData,
            districtCode: undefined, // 清空县
          });
        }
      },
      {
        id: 'districtCode',
        width: '150',
        type: 'select',
        required: true,
        placeholder: '请选择县',
        validatorKey: 'if',
        validator: (context) => {
          return !(context.formData.cityCode && vue.getCommonDictionary('area').filter(ad => ad.p === context.formData.cityCode).length === 0);
        },
        field: {
          labelKey: 'n',
          valueKey: 'c',
          options: 'DISTRICT_CODE_OPTIONS',
          optionsFilter: (_, context) => vue.getCommonDictionary('area').filter(ad => ad.p === context.formData.cityCode),
        }
      },
    ]
  },
  {
    label: '联系地址',
    id: 'linkmanAddress',
    width: '150',
    type: 'textarea',
    required: true,
    maxlength: 200,
    editable: true,
  },
];

function sign(row, caToken, context) {
  context.customDialog = {
    visible: true,
    title: '签字',
    center: true,
    componentName: 'SignatureDialog',
    onChange: async (result, context) => {
      await apiPromise('da', 'merchantDeliveryApplySign', {
        caToken,
        id: row.id,
        signUrl: result.url
      }, context);
      context.$toast({ text: '签字成功' });
      context.getData();
    }
  };
}

const LINKMAN_COLS = [
  {
    label: '联系人类型',
    id: 'linkmanType',
    width: '150',
    searchable: false,
    disabled: true,
    editable: true,
    type: 'select',
    required: true,
    defaultValue: 'e449f9a28d2411edb156b8599feb8001',
    field: {
      labelKey: 'name',
      valueKey: 'id',
      options: 'LINKMAN_TYPE_OPTIONS',
    },
    init: (context) => {
      context.API.send(context.CFG.services.uaapi.selectCaLinkmanType, {}, (res) => {
        const data = res.data || [];
        context.$set(context.options, 'LINKMAN_TYPE_OPTIONS', data);
      }, () => {}, context);
    }
  },
  {
    label: '联系人姓名',
    id: 'name',
    width: '150',
    type: 'text',
    maxlength: 100,
    searchable: true,
    editable: true,
    required: true,
  },
  {
    label: '联系人手机号',
    id: 'cellphone',
    width: '150',
    type: 'text',
    searchable: true,
    editable: true,
    required: true,
    rules: [
      {
        pattern: /^1[3-9]\d{9}$/, // 手机号正则（中国大陆）
        message: '请输入正确的11位手机号',
        trigger: ['blur', 'change']
      }
    ]
  },
  {
    label: '联系人座机号',
    id: 'landlinePhone',
    width: '150',
    type: 'text',
    searchable: true,
    editable: true,
    rules: [
      {
        pattern: /^(?=.*\d)[0-9()\- +]+$/, // 座机号正则（中国大陆）
        message: '请输入正确的座机号',
        trigger: ['blur', 'change']
      }
    ]
  },
  {
    label: '电子邮箱',
    id: 'linkmanEmail',
    width: '150',
    type: 'text',
    searchable: true,
    editable: true,
    rules: [
      {
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // 邮箱正则
        message: '请输入正确的邮箱地址',
        trigger: ['blur', 'change']
      }
    ]
  },
  {
    label: '省',
    id: 'provinceName',
    width: '150',
    type: 'text',
    render: (row) => {
      return vue.getCommonDictionary('area').find(ad => ad.c === row.provinceCode)?.n || '';
    }
  },
  {
    label: '市',
    id: 'cityName',
    width: '150',
    type: 'text',
    render: (row) => {
      return vue.getCommonDictionary('area').find(ad => ad.c === row.cityCode)?.n || '';
    }
  },
  {
    label: '县',
    id: 'districtName',
    width: '150',
    type: 'text',
    render: (row) => {
      return vue.getCommonDictionary('area').find(ad => ad.c === row.districtCode)?.n || '';
    }
  },
  {
    id: 'source',
    type: 'text',
    listable: false,
    editable: true,
    validatorKey: 'show',
    validator: () => false,
    defaultValue: (context) => context.CFG.project.id,
  },
  {
    id: 'sourceProduct',
    type: 'text',
    listable: false,
    editable: true,
    validatorKey: 'show',
    validator: () => false,
    defaultValue: (context) => context.CFG.project.id,
  },
  ...ADDRESS_COLS,
];
/**
 * 组件列
 */
const COMPONENT_COLS = [
  /**
   * 发货方信息 Columns
   */
  {
    label: '发货方类型',
    id: 'delivererType',
    width: '100',
    type: 'select',
    required: true,
    searchable: false,
    listable: true,
    editable: true,
    disabled: (context) => disabledModifyStopApply(context) || context.formData.contractId,
    field: {
      labelKey: 'label',
      valueKey: 'value',
      options: OWNER_TYPE_OPTIONS
    },
    defaultValue: '2',
    render: (row) => {
      return renderOptionLabel({
        row,
        options: OWNER_TYPE_OPTIONS,
        field: 'delivererType'
      });
    },
    onChange: (value, context) => {
      context.$emit('update:formData', {
        ...context.formData,
        delivererId: undefined, // 清空发货方ID
        delivererName: undefined, // 清空发货方名称
        delivererCellphone: undefined, // 清空发货方联系方式
        delivererAddress: undefined, // 清空发货方地址
      });
    },
  },
  {
    label: '发货方',
    id: 'delivererId',
    width: '150',
    required: true,
    listable: false,
    editable: true,
    disabled: (context) => disabledModifyStopApply(context) || !context.formData.delivererType || context.formData.contractId,
    type: 'selectTableDialog',
    validatorKey: 'if',
    validator: (context) => context.formData.delivererType,
    field: {
      labelRenderer: (row, context) => {
        if (context.formData.delivererType === '1') {
          const cellphone = row.delivererCellphone ? `（${row.delivererCellphone}）` : '';
          return `${row.delivererName || ''}${cellphone}`;
        }
        return row.delivererName;
      }
    },
    selectTable: {
      onClick: (context, type) => {
        context.$emit('selectTableShow', {
          ...(context.formData.delivererType === '1' ? HUMAN_SELECT_TABLE_CONFIG : ORG_SELECT_TABLE_CONFIG),
          type,
          onConfirm: (item, context) => {
            const confirmed = context.formData.delivererType === '1' ?{
              delivererId: item.id,
              delivererName: item.name,
              delivererCellphone: item.cellphone,
              delivererAddress: undefined,
            } : {
              delivererId: item.id,
              delivererName: item.name,
              delivererCellphone: undefined,
              delivererAddress: item.address,
            };
            context.formData = {
              ...context.formData,
              ...confirmed,
            };
          }
        });
      }
    },
  },
  {
    label: '发货方',
    id: 'delivererName',
    width: '150',
    searchable: true,
    listable: true,
    editable: false,
    disabled: true,
    type: 'text',
    render: (row) => {
      const cellphone = row.delivererCellphone? `（${row.delivererCellphone}）` : '';
      return row.delivererType === '1' ? `${row.delivererName || ''}${cellphone}` : row.delivererName;
    }
  },

  /**
   * 收货方信息 Columns
   */
  {
    label: '收货方类型',
    id: 'consigneeType',
    width: '100',
    type: 'select',
    required: true,
    searchable: false,
    listable: true,
    editable: true,
    disabled: (context) => disabledModifyStopApply(context) || context.formData.contractId,
    field: {
      labelKey: 'label',
      valueKey: 'value',
      options: OWNER_TYPE_OPTIONS
    },
    defaultValue: '2',
    render: (row) => {
      return renderOptionLabel({
        row,
        options: OWNER_TYPE_OPTIONS,
        field: 'consigneeType'
      });
    },
    onChange: (value, context) => {
      context.$emit('update:formData', {
        ...context.formData,
        consigneeId: undefined, // 清空收货方ID
        consigneeName: undefined, // 清空收货方名称
        consigneeCellphone: undefined, // 清空收货方联系方式
        consigneeAddress: undefined, // 清空收货方地址
      });
    },
  },
  {
    label: '收货方',
    id: 'consigneeId',
    width: '150',
    required: true,
    listable: false,
    editable: true,
    disabled: (context) => disabledModifyStopApply(context) || !context.formData.consigneeType || context.formData.contractId,
    type: 'selectTableDialog',
    validatorKey: 'if',
    validator: (context) => context.formData.consigneeType,
    field: {
      labelRenderer: (row, context) => {
        if (context.formData.consigneeType === '1') {
          const cellphone = row.consigneeCellphone ? `（${row.consigneeCellphone}）` : '';
          return `${row.consigneeName || ''}${cellphone}`;
        }
        return row.consigneeName;
      }
    },
    selectTable: {
      onClick: (context, type) => {
        context.$emit('selectTableShow', {
          ...(context.formData.consigneeType === '1' ? HUMAN_SELECT_TABLE_CONFIG : ORG_SELECT_TABLE_CONFIG),
          type,
          onConfirm: (item, context) => {
            const confirmed = context.formData.consigneeType === '1' ?{
              consigneeId: item.id,
              consigneeName: item.name,
              consigneeCellphone: item.cellphone,
              consigneeAddress: undefined,
            } : {
              consigneeId: item.id,
              consigneeName: item.name,
              consigneeCellphone: undefined,
              consigneeAddress: item.address,
            };
            context.formData = {
              ...context.formData,
              ...confirmed,
            };
            /**
             * 获取商户信息
             */
            getMerchantInfo(item.id, context);
            /**
             * 获取收货方负责人信息
             */
            getConsigneeLinkmanList(item.id, context);
          }
        });
      }
    },
  },
  {
    label: '收货方',
    id: 'consigneeName',
    width: '150',
    searchable: true,
    listable: true,
    editable: false,
    disabled: true,
    type: 'text',
    render: (row) => {
      const cellphone = row.consigneeCellphone ? `（${row.consigneeCellphone}）` : '';
      return row.consigneeType === '1' ? `${row.consigneeName || ''}${cellphone}` : row.consigneeName;
    }
  },
  {
    label: '收货方地址',
    id: 'consigneeAddress',
    listable: false,
    editable: true,
    validatorKey: 'if',
    validator: (context) => context.formData.consigneeType === '2' && context.formData.consigneeId,
    disabled: true,
    type: 'textarea'
  },
  {
    label: '商户',
    id: 'merchantId',
    width: '150',
    type: 'select',
    searchable: false,
    listable: true,
    editable: true,
    disabled: disabledModifyStopApply,
    required: true,
    validatorKey: 'if',
    validator: (context) => context.formData.consigneeId,
    field: {
      labelKey: 'name',
      valueKey: 'id',
      options: 'MERCHANT_ID_OPTIONS'
    },
    render: (row) => row.merchantName,
  },
  {
    label: '机构负责人',
    id: 'consigneeLinkmanList',
    xs: 12,
    required: true,
    validatorKey: 'if',
    validator: (context) => context.formData.consigneeId,
    disabled: (_, disabledType) => disabledType === 'delete',
    type: 'tagList',
    field: {
      labelRenderer: (row) => {
        if (row.name) {
          const cellphone = row.cellphone? `（${row.cellphone}）` : '';
          return `${row.name || ''}${cellphone}`;
        }
        return '';
      }
    },
    editConfig: (context) => ({
      module: 'ca',
      create: 'linkmanApplyAutoCreate',
      createParams: {
        orgId: context.formData.consigneeId,
      },
      rowField: { width: '591px' },
      cols: LINKMAN_COLS.map(col => {
        if (col.id === 'linkmanType') {
          return {
            ...col,
            defaultValue: '2c06094c0ccd11f08d1cb8599feb8d24',
          };
        }
        return { ...col };
      }),
      onConfirm: (item, row, rowIndex, context) => {
        context.API.send(context.CFG.services.ca.linkmanListWithoutPermission, {
          orgId: context.formData.consigneeId,
          current: 1,
          rowCount: 100,
          linkmanType: '2c06094c0ccd11f08d1cb8599feb8d24', // 机构负责人类型 ID
        }, (res) => {
          const data = res.serviceResult.rows || [];
          context.$set(context.formData, 'consigneeLinkmanList', data);
        }, () => {
        }, context);
      }
    }),
    searchable: false,
    listable: false,
    editable: true,
  },
  /**
   * 发货确认信息 Columns
   */
  {
    label: '交付类型',
    id: 'deliveryTypeId',
    width: '150',
    type: 'select',
    required: true,
    listable: false,
    editable: true,
    disabled: true,
    defaultValue: 'f6287cb87ac54c7d85c9ef7946430031',
    field: {
      labelKey: 'name',
      valueKey: 'id',
      options: [
        { name: "送至指定地点", id: "f6287cb87ac54c7d85c9ef7946430031" },
      ],
    },
  },
  {
    label: '交付方式',
    id: 'deliveryMethodId',
    width: '150',
    type: 'select',
    required: true,
    listable: false,
    editable: true,
    disabled: true,
    defaultValue: '0309863765d943c8abae775607879779',
    field: {
      labelKey: 'name',
      valueKey: 'id',
      options: [
        { name: "领用", id: "0309863765d943c8abae775607879779" }
      ],
    },
  },
  {
    label: '优氧协议 ID',
    id: 'contractId',
    width: '150',
    disabled: true,
    listable: false,
    editable: true,
    type: 'text',
  },
  {
    label: '优氧协议签署时间',
    id: 'contractSignTime',
    width: '180',
    type: 'date',
    disabled: true,
    listable: false,
    editable: true,
    format: 'yyyy-MM-dd hh:mm:ss',
  },
  {
    label: '收货日期',
    id: 'deliveryDateParent',
    xs: 12,
    type: 'row',
    width: '100',
    required: true,
    listable: true,
    editable: true,
    children: [
      { type: 'show', defaultValue: '您可以在' },
      {
        id: 'deliveryDate',
        width: '180',
        type: 'date',
        required: true,
        placeholder: '请选择收货日期',
        listable: false,
        editable: true,
        format: 'yyyy年MM月dd日',
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < new Date().getTime() - 24 * 60 * 60 * 1000;
          }
        },
      },
      { type: 'show', defaultValue: '起之后的任一日期接收我们的商品。' },
    ],
    renderjxs: (scope, h) => {
      const deliveryDate = scope?._self.utils.formatDate(scope.row.deliveryDate, 'yyyy-MM-dd');
      if (deliveryDate) {
        return h(
          'span',
          {},
          [deliveryDate]
        );
      }
    }
  },
  {
    label: '收货日期说明',
    id: 'deliveryDateDescribe',
    editable: true,
    maxlength: 200,
    type: 'textarea'
  },
  {
    label: '收货联系人',
    id: 'deliveryLinkmanId',
    width: '150',
    required: true,
    listable: true,
    editable: true,
    type: 'selectTablePage',
    validatorKey: 'if',
    validator: (context) => context.formData.consigneeId,
    field: {
      labelRenderer: (row) => {
        const cellphone = row.deliveryLinkmanCellphone ? `（${row.deliveryLinkmanCellphone}）` : '';
        return `${row.deliveryLinkmanName || ''}${cellphone}`;
      }
    },
    selectTable: {
      onClick: (context, type) => {
        context.$emit('selectTableShow', {
          title: '选择联系人',
          apiModule: 'ca',
          apiKey: 'linkmanListWithoutPermission',
          rowKey: 'id',
          params: {
            orgId: context.formData.consigneeId,
          },
          immediate: true,
          type,
          cols: LINKMAN_COLS,
          editConfig: {
            add: true,
            module: 'ca',
            create: 'linkmanApplyAutoCreate',
            createParams: {
              orgId: context.formData.consigneeId,
            },
            rowField: { width: '591px' }
          },
          onConfirm: (item, context) => {
            context.formData = {
              ...context.formData,
              deliveryLinkmanId: item.id,
              deliveryLinkmanName: item.name,
              deliveryLinkmanCellphone: item.cellphone,
              deliveryLinkmanProvince: item.provinceCode,
              deliveryLinkmanCity: item.cityCode,
              deliveryLinkmanDistrict: item.districtCode,
              deliveryLinkmanAddress: item.linkmanAddress,
            };
          }
        });
      }
    },
    render: (row) => {
      const cellphone = row.deliveryLinkmanCellphone ? `（${row.deliveryLinkmanCellphone}）` : '';
      return `${row.deliveryLinkmanName || ''}${cellphone}`;
    }
  },
  {
    label: '收货联系人省市县',
    id: 'deliveryLinkmanAddressProvinceCityDistrict',
    width: '150',
    type: 'row',
    xs: 12,
    validatorKey: 'if',
    validator: (context) => context.formData.deliveryLinkmanId,
    editable: true,
    children: [
      {
        id: 'deliveryLinkmanProvince',
        width: '150',
        disabled: true,
        type: 'select',
        field: {
          labelKey: 'n',
          valueKey: 'c',
          options: vue.getCommonDictionary('area'),
        },
      },
      {
        id: 'deliveryLinkmanCity',
        width: '150',
        type: 'select',
        disabled: true,
        field: {
          labelKey: 'n',
          valueKey: 'c',
          options: vue.getCommonDictionary('area'),
        },
      },
      {
        id: 'deliveryLinkmanDistrict',
        width: '150',
        type: 'select',
        validatorKey: 'if',
        validator: (context) => {
          return !(context.formData.deliveryLinkmanCity && vue.getCommonDictionary('area').filter(ad => ad.p === context.formData.deliveryLinkmanCity).length === 0);
        },
        disabled: true,
        field: {
          labelKey: 'n',
          valueKey: 'c',
          options: vue.getCommonDictionary('area'),
        },
      }
    ]
  },
  {
    label: '收货联系人省',
    id: 'deliveryLinkmanProvince',
    width: '150',
    type: 'text',
    listable: true,
    editable: false,
    render: (row) => {
      return vue.getCommonDictionary('area').find(ad => ad.c === row.deliveryLinkmanProvince)?.n || '';
    }
  },
  {
    label: '收货联系人市',
    id: 'deliveryLinkmanCity',
    width: '150',
    type: 'text',
    listable: true,
    editable: false,
    render: (row) => {
      return vue.getCommonDictionary('area').find(ad => ad.c === row.deliveryLinkmanCity)?.n || '';
    }
  },
  {
    label: '收货联系人县',
    id: 'deliveryLinkmanDistrict',
    width: '150',
    type: 'text',
    listable: true,
    editable: false,
    render: (row) => {
      return vue.getCommonDictionary('area').find(ad => ad.c === row.deliveryLinkmanDistrict)?.n || '';
    }
  },
  {
    label: '收货联系人地址',
    id: 'deliveryLinkmanAddress',
    listable: true,
    editable: true,
    disabled: true,
    validatorKey: 'if',
    validator: (context) => context.formData.deliveryLinkmanId,
    width: '150',
    type: 'textarea',
    maxlength: 200,
  },

  {
    id: 'assetList', // ID
    type: 'table', // 类型
    listable: false, // 是否显示在列表中(通常设置为 false)
    editable: true, // 是否可以编辑表单(通常设置为 true)
    required: true, // 是否必填(通常设置为 true)
    title: '资产信息', // 表格标题 (有标题, 则表格显示为卡片)
    add: {
      buttonText: '选择资产', // 添加按钮文本
    },
    disabled: (context, disabledType) => disabledModifyStopApply(context) || disabledType === 'edit' || context.formData.contractId,
    ootListConfig: {
      ootCategory: '4',
      categoryList: [4],
      onChange: (data, context) => {
        let resData = [];
        if(!Array.isArray(data)){
          resData.push(data);
        } else {
          resData = data;
        }
        const assetList = context.formData.assetList || [];
        resData.forEach((spu)=>{
          let fOne = assetList.find((v)=> v.assetId === spu.id);
          if(fOne){
            return;
          }
          spu.assetId = spu.id;
          spu.unit = spu.mainUnit;
          spu.num = 1;
          assetList.push(spu);
        });
        context.formData = {
          ...context.formData,
          assetList,
        };
        context.$nextTick(()=>{
          context.$refs.deliveryInfoRef?.[0].$refs.formDom?.validateField('assetList');
        });
      }
    },
    cols: [
      { label: '产品名称', id: 'assetName', width: '120', render: (row) => row.assetName || row.name},
      { label: '资产类型', id: 'assetTypeValue', width: '120',  },
      { label: '交易标的ID', id: 'assetId',width: '120',  },
      { label: '是否为组合资产', id: 'isPortfolio', width: '180', render:(row)=>{
        if(row.isPortfolio === 1){
          return '是'
        }else if(row.isPortfolio === 0){
          return '否'
        }
      } },
      { label: '数量', id: 'num', width: '140', renderjxs: (scope, h) => {
        return h('el-input-number', {
          props: {
            value: scope.row.num,
            min: 1,
            type: 'number',
            size: 'small',
            placeholder: '请输入数量',
            disabled: scope.row._selfTable.disabled || scope.row._selfTable.getItemDisabled(scope.row._selfTable.item),
          },
          on: {
            input: (value) => {
              scope.row._selfTable.$set(scope.row._selfTable.formData.assetList, scope.$index, { ...scope.row, num: value, _selfTable: undefined });
            }
          }
        });
      }
      },
      { label: '单位', id: 'unit', width: '50' },
      { label: '说明', id: 'describe', width: '120' , renderjxs: (scope, h) => {
        return h('el-input', {
          props: {
            value: scope.row.describe,
            type: 'textarea',
            clearable: true,
            maxlength: 200,
            placeholder: '请输入说明',
            disabled: scope.row._selfTable.disabled || scope.row._selfTable.getItemDisabled(scope.row._selfTable.item),
          },
          on: {
            input: (value) => {
              scope.row._selfTable.$set(scope.row._selfTable.formData.assetList, scope.$index, { ...scope.row, describe: value, _selfTable: undefined });
            }
          }
        });
      }},
    ]
  },

  /**
   * 签字信息 Columns
   */
  {
    label: '负责人签字',
    id: 'directorSignUrl',
    width: '150',
    type: 'uploadImage',
    validatorKey: 'if',
    validator: (context) => context.formData.directorSignUrl,
    disabled: true,
    listable: true,
    editable: true,
    accept: ['.jpg', '.jpeg', '.png', '.bmp'],
    renderjxs: (scope, h) => {
      if (scope.row.directorSignUrl) {
        return h('viewer', {
          props: {
            images: [scope.row.directorSignUrl],
          },
        }, [
          h('img', {
            attrs: {
              src: scope.row.directorSignUrl,
              alt: '负责人签字',
            },
            style: {
              width: '100%',
              maxWidth: '300px',
              objectFit: 'contain',
            },
          })
        ]);
      }
    }
  },
  {
    label: '负责人签字时间',
    id: 'directorSignTime',
    width: '180',
    type: 'date',
    validatorKey: 'if',
    validator: (context) => context.formData.directorSignTime,
    disabled: true,
    editable: true,
    format: 'yyyy-MM-dd hh:mm:ss',
  },
  {
    label: '商户管理员签字',
    id: 'merchantSignUrl',
    width: '150',
    type: 'uploadImage',
    validatorKey: 'if',
    validator: (context) => context.formData.merchantSignUrl,
    disabled: true,
    listable: false,
    editable: true,
    accept: ['.jpg', '.jpeg', '.png', '.bmp'],
  },
  {
    label: '商户管理员签字时间',
    id: 'merchantSignTime',
    width: '180',
    type: 'date',
    validatorKey: 'if',
    validator: (context) => context.formData.merchantSignTime,
    disabled: true,
    editable: true,
    format: 'yyyy-MM-dd hh:mm:ss',
  },
  //单据卡片列表
  ...AUDIT_CARD_COLS,
  // 调整单单据列表
  ...AUDIT_CARD_ADJUST_COLS,
  { id: 'newLine', type: 'newLine' },
];

/**
 * 详情页搜索查询
 */
const DETAIL_SEARCH_CARD_CONFIG = {
  title: '查询氧舱商户发货确认单', // 标题
  cols: COMPONENT_COLS, // 列
  apiModule: COMPONENT_API_CONFIG.module, // apiModule
  apiKey: COMPONENT_API_CONFIG.list, // apiKey
  needDetail: true,
  params: {}, // 搜索查询参数
  cardTitlePrefix: '', // 搜索条目卡片标题
  cardTitleKey: '', // 搜索条目卡片标题 Key
  onConfirm: (result, context) => {
    if (context.formData.consigneeId) {
      getMerchantInfo(context.formData.consigneeId, context);
      getConsigneeLinkmanList(context.formData.consigneeId, context);
    }
    getAssetList(context);
    context.formData = {
      ...context.formData,
      directorSignUrl: undefined,
      directorSignTime: undefined,
      merchantSignUrl: undefined,
      merchantSignTime: undefined,
    }
  }
};

/**
 * 组件配置
 */
const COMPONENT_CONFIG = {
  // 组件 API 信息
  ...COMPONENT_API_CONFIG,
  resultId: 'merchantDeliveryId',
  oss: {}, // 组件 oss
  hasVetting: true,
  detailPageTitle: {
    create: '氧舱商户发货确认单',
    modify: '氧舱商户发货修改确认单',
    stop: '氧舱商户取消发货确认单',
    adjust: '氧舱商户发货确认待生效数据调整单'
  },
  // 详情页搜索查询卡片
  detailSearchCard: {
    modify: DETAIL_SEARCH_CARD_CONFIG,
    stop: DETAIL_SEARCH_CARD_CONFIG,
    adjust: {
      ...DETAIL_SEARCH_CARD_CONFIG,
      title: '查询氧舱商户发货确认单单据',
      params: {},
      apiKey: COMPONENT_API_CONFIG.listDirective,
      cols: [
        ...DETAIL_SEARCH_CARD_CONFIG.cols,
        AUDIT_TYPE_COL,
        AUDIT_TYPE_SEARCH_COL,
      ]
    },
  },
  listActions: (btns, context) => {
    btns.splice(4, 0, {
      name: '签署',
      click: async (row) => {
        const permission = await apiPromise('da', 'merchantDeliveryApplyCheckSignHuman', { id: row.id }, context);
        /**
         * 校验签字人接口
         *
         * 0-非法签字人或未审核通过
         * 1-负责人
         * 2商户管理员
         * 3-签字流程完成
         * 4商户管理员但未到签字步骤
         */
        if (permission === '0') {
          context.$toast({ text: '抱歉，您没有签字权限' });
        } else if (['1', '2'].includes(permission)) {
          const authInfo = await apiPromise('ectapi', 'authQueryPersonAuthInfoByHumanId', { id: row.id }, context);
          // status=4 表示已经法大大实名认证
          if (String(authInfo?.status) === '4') {
            const caToken = await context.$caTokenTools.get(context.CFG.userInfo.id);
            const caInfo = await apiPromise('lca', 'certGetAuthStatus', {
              caToken,
              humanId: context.CFG.userInfo.id,
              terminalId: context.CFG.terminalId
            }, context);
            if (caInfo?.status === '0') {
              sign(row, caToken, context);
            } else {
              context.$caTokenTools.remove(context.CFG.userInfo.id)
              context.$toast({ text: '请进行人脸识别后签字' });
              context.customDialog = {
                visible: true,
                center: true,
                title: '人脸识别',
                componentName: 'AuthenticationDialog',
                onChange: async (faceUrl, context) => {
                  const caRealNameResult = await apiPromise('lca', 'certAuthByFace', {
                    imageUrl: faceUrl,
                    humanId: context.CFG.userInfo.id,
                    terminalId: context.CFG.terminalId
                  }, context);
                  if (caRealNameResult?.caToken) {
                    context.$caTokenTools.set(context.CFG.userInfo.id, caRealNameResult.caToken);
                    context.$toast({ text: '人脸识别成功，请签字' });
                    sign(row, caRealNameResult.caToken, context);
                  } else {
                    context.$toast({ text: '人脸识别失败' });
                    context.customDialog.visible = false;
                  }
                }
              }
            }
          } else if (context.CFG.client?.isMiniprogram) {
            // 小程序中， 需要进入 App 进行实名认证
            context.$toast({ text: '请您进入 App 进行实名认证' });
          } else {
            context.$confirm({
              title: '提示',
              text: `签署之前必须法大大实名认证？`,
              buttons: [
                {
                  text: '取消',
                  type: 'follow'
                },
                {
                  text: '确定',
                  type: 'primary',
                  callback: () => {
                    LonchJsApi.openUrl({
                      originName: 'manage',
                      routePath:'/admin/eContract/certificationPersonal',
                      query: {
                        moduleCode: '140300',
                        isback: 'true',
                        appName: 'manage'
                      }
                    });
                  }
                }
              ]
            })
          }
        } else if (permission === '3') {
          context.$toast({ text: '已签署，无需重复签字' });
        } else if (permission === '4') {
          context.$toast({ text: '请您等待负责人签字后，进行签字' });
        }
      },
      // 和审批状态一样
      isDisabled: (row) => {
        return !['6'].includes(row.auditStatus);
      },
      condition: () => context.permissions.names.custom2 || context.isDev
    });
    return btns.map((btn) => {
      if (btn.name === '删除') {
        btn.click = (row) => {
          if (row.contractId && context.auditType === 'create') {
            context.$toast({ text: '从优氧协议自动创建的单据不可以删除' });
          } else {
            context.toDelete(row);
          }
        }
      }
      return btn;
    })
  },
  cols: (context) => {
    return COMPONENT_COLS.map(col => {
      if (context.$route.query.merchantId) {
        return {
          ...col,
          searchable: false,
        }
      }
      return col;
    });
  }, // 组件列信息
  /**
   * 详情页卡片
   */
  detailCards: [
    {
      title: '发货方信息',
      cols: [
        'delivererType', 'delivererId', 'delivererAddress',
      ]
    },
    {
      title: '收货方信息',
      cols: [
        'consigneeType', 'consigneeId', 'consigneeAddress',
        'merchantId', 'consigneeLinkmanList',
      ]
    },
    {
      title: '优氧合同信息',
      validatorKey: 'if',
      validator: (context) => {
        return context.formData.contractId || context.formData.contractSignTime;
      },
      cols: ['contractId', 'contractSignTime']
    },
    {
      title: '发货确认信息',
      ref: 'deliveryInfoRef',
      cols: [
        'deliveryTypeId', 'deliveryMethodId',
        'deliveryDateParent', 'deliveryDateDescribe', 'deliveryLinkmanId', 'deliveryLinkmanAddressProvinceCityDistrict', 'deliveryLinkmanAddress', 'assetList'
      ]
    },
    {
      title: '签字信息',
      validatorKey: 'if',
      validator: (context) => {
        return context.formData.directorSignUrl || context.formData.merchantSignUrl;
      },
      cols: [
        'directorSignUrl', 'directorSignTime',
        'merchantSignUrl', 'merchantSignTime'
      ]
    },
    //单据卡片
    {
      ...AUDIT_CARD,
      cols: ['source', 'effectType', 'effectTime', 'formRemark']
    },
  ],
  listParams: (context) => {
    if (context.$route.query.merchantId) {
      return {
        merchantId: context.$route.query.merchantId,
      };
    }
    return {};
  },
  updateParams: (_, params) => {
    return {...params, consigneeLinkmanList: undefined };
  },
  afterDetails: (context) => {
    if (context.formData.consigneeId) {
      getMerchantInfo(context.formData.consigneeId, context);
      getConsigneeLinkmanList(context.formData.consigneeId, context);
    }
    getAssetList(context);
  }
};

/**
 * 导出组件配置
 */
export { COMPONENT_CONFIG };
