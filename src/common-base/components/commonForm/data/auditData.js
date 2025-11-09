/*
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2025-02-14 15:00:48
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-02-17 23:20:40
 * @FilePath: \lonch-rxv-fe\src\common-base\components\commonForm\data\auditData.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2024-01-18 01:30:27
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-02-17 12:44:44
 * @FilePath: \lonch-rxv-fe\src\components\admin\adverseDrugReaction\data\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { renderOptionLabel } from '@/common-base/components/commonForm/utils/renderUtils';

// 单据状态, 仅审核
const AUDIT_STATUS_OPTIONS = [
  { label: '申请中', value: '1' },
  { label: '审核通过', value: '2' },
  { label: '驳回', value: '3' },
  { label: '审核不通过', value: '4' },
  { label: '失败', value: '5' }
];

// 单据状态, 审核 + 审批
const AUDIT_VETTING_STATUS_OPTIONS = [
  { label: '申请中', value: '1' },
  { label: '审核审批通过', value: '2' },
  { label: '驳回', value: '3' },
  { label: '审核不通过', value: '4' },
  { label: '失败', value: '5' },
  { label: '审核通过，未审批', value: '6' }
];

const AUDIT_ADJUST_EFFECT_OPTIONS = [
  { label: '立即生效', value: '1' },
  { label: '延迟生效', value: '2' }
];

const AUDIT_TYPE_OPTIONS = [
  { label: '申请', value: '1' },
  { label: '变更申请', value: '2' },
  { label: '调整申请', value: '3' },
  { label: '调整变更申请', value: '4' },
  { label: '作废申请', value: '5' },
  { label: '调整作废申请', value: '6' },
];

const AUDIT_TYPE_COL = {
  label: '指令集类型',
  id: 'type',
  type: 'text',
  width: '150',
  listable: true,
  render: (row) => {
    return renderOptionLabel({
      row,
      options: AUDIT_TYPE_OPTIONS,
      field: 'type'
    });
  }
};

const AUDIT_TYPE_SEARCH_COL = {
  label: '单据类型',
  type: 'select',
  searchable: true,
  id: 'types',
  field: {
    labelKey: 'label',
    valueKey: 'value',
    options: [
      { label: '申请单', value: ['1', '3'] },
      { label: '修改单', value: ['2', '4'] },
      { label: '终止单', value: ['5', '6'] },
    ],
  },
};

// 审核单列表
const AUDIT_COMMON_COLS = [
  {
    label: '调整单类型',
    id: 'directiveType',
    width: '150',
    renderjxs: (scope, h) => {
      return h(
        'el-tag',
        {
          props: {
            type: scope.row.directiveType === '1' ? 'success' : 'danger'
          }
        },
        scope.row.directiveType === '1' ? '修改单' : '终止单'
      );
    }
  },
  AUDIT_TYPE_COL,
  {
    label: '制单时间',
    id: 'formCreateTime',
    width: '180',
    type: 'date',
    format: 'yyyy-MM-dd hh:mm:ss'
  },
  {
    label: '制单人',
    id: 'creatorName',
    width: '150',
    render(row) {
      if (row.creator === 'system') {
        return '系统自动';
      }
      return row.creatorName;
    }
  },
  {
    label: '申请时间',
    id: 'applicationDate',
    width: '180',
    type: 'date',
    format: 'yyyy-MM-dd hh:mm:ss'
  },
  {
    label: '申请人',
    id: 'applicantName',
    width: '150',
    render(row) {
      if (row.applicant === 'system') {
        return '系统自动';
      }
      return row.applicantName;
    }
  },
  {
    label: '审核时间',
    id: 'auditDate',
    width: '180',
    type: 'date',
    format: 'yyyy-MM-dd hh:mm:ss'
  },
  {
    label: '审核人',
    id: 'auditorName',
    width: '150',
    render(row) {
      if (row.auditor === 'system') {
        return '系统自动';
      }
      return row.auditorName;
    }
  },
  { label: '审核意见', id: 'auditComment', width: '150' },
  {
    label: '审核状态',
    id: 'auditStatus',
    width: '150',
    render: (row) => {
      return renderOptionLabel({
        row,
        options: row.$$hasVetting
          ? AUDIT_VETTING_STATUS_OPTIONS
          : AUDIT_STATUS_OPTIONS,
        field: 'auditStatus'
      });
    }
  }
];

const AUDIT_PARAMS_MAP = {
  create: { type: '1' },
  modify: { type: '2' },
  adjustCreate: { type: '3' },
  adjustModify: { type: '4' },
  stop: { type: '5' },
  adjustStop: { type: '6' },
  adjust: { types: ['3', '4', '6'] },
  adjustUpdate: {
    '1': { type: '3' },
    '3': { type: '3' },
    '2': { type: '4' },
    '4': { type: '4' },
    '5': { type: '6' },
    '6': { type: '6' }
  },
};

const AUDIT_CARD = {
  title: '单据信息',
  ref: 'AuditCardRef',
  disabled: (context) => context.params.type === 'details',
  validatorKey: 'show',
  validator: (context) => {
    return context.auditType !== 'statement' && context.params.isAuto !== '1';
  },
  cols: ['source', 'formRemark']
};

const AUDIT_CARD_ADJUST_COLS = [
  {
    label: '生效方式',
    id: 'effectType',
    width: '150',
    type: 'radio', // 类型 radio | radioButton
    required: true,
    editable: true,
    maxlength: 100,
    listable: true,
    field: {
      labelKey: 'label',
      valueKey: 'value',
      options: AUDIT_ADJUST_EFFECT_OPTIONS
    },
    render: (row) => {
      return renderOptionLabel({
        row,
        options: AUDIT_ADJUST_EFFECT_OPTIONS,
        field: 'effectType'
      });
    }
  },
  {
    label: '生效时间',
    id: 'effectTime',
    width: '180',
    type: 'date',
    validatorKey: 'if',
    validator: (context) => {
      return (
        context.formData.effectType === '2'
      );
    },
    required: true,
    listable: true,
    editable: true,
    format: 'yyyy-MM-dd hh:mm:ss' // 日期格式 'yyyy-MM-dd' 或 'yyyy-MM-dd hh:mm:ss',
  },
];

const AUDIT_CARD_COLS = [
  {
    label: '单据来源',
    id: 'source',
    disabled: true,
    required: true,
    listable: false,
    editable: true,
    type: 'select',
    xs: 12,
    defaultValue: (context) => context.CFG.project.id,
    field: {
      labelKey: 'title',
      valueKey: 'id',
      optionsFilter: (options, context) => {
        return context.CFG.projects;
      }
    }
  },
  {
    label: '单据备注',
    id: 'formRemark',
    type: 'textarea', // 类型
    maxlength: 800, // 文字最大长度
    searchable: false, // 列表中是否可搜索
    listable: false, // 是否显示在列表中
    editable: true, // 是否可编辑表单
    disabled: false // 是否禁用
  }
];

/**
 * 修改单、作废单 禁用函数
 * 
 * @params Object context 运行时
 * @return Boolean 
 */
function disabledModifyStopApply(context) {
  if (['modify', 'stop'].includes(context.auditType)) {
    return true;
  }
  if (context.auditType === 'adjust' && ['2', '4', '5', '6'].includes(context.formData.type)) {
    return true;
  }
  return false; 
}

export {
  AUDIT_STATUS_OPTIONS,
  AUDIT_VETTING_STATUS_OPTIONS,
  AUDIT_CARD_ADJUST_COLS,
  AUDIT_COMMON_COLS,
  AUDIT_TYPE_COL,
  AUDIT_TYPE_SEARCH_COL,
  AUDIT_PARAMS_MAP,
  AUDIT_CARD,
  AUDIT_CARD_COLS,
  disabledModifyStopApply,
};
