/*
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2025-01-02 21:08:30
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-03-06 22:43:01
 * @FilePath: \lonch-itoc\src\components\admin\seal\data\dictData.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2025-01-02 21:08:30
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-01-02 21:11:05
 * @FilePath: \lonch-itoc\src\components\admin\seal\data\dictData.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { AUDIT_CARD_COLS } from '@/common-base/components/commonForm/data/auditData';

const SEAL_DICT_API_CONFIG = {
  module: 'seal',
  list: 'bizDicGetAllBizDic',
  create: 'bizDicCreateBizDic',
  update: 'bizDicEditBizDic',
};

const MPMAPI_DICT_API_CONFIG = {
  module: 'mpmapi',
  list: 'getAllBizDic',
  create: 'createBizDic',
  update: 'editBizDic',
};

const RXV_DICT_API_CONFIG = {
  module: 'rxv',
  list: 'gatherBizDicGetAllBizDic',
  create: 'gatherBizDicCreateBizDic',
  update: 'gatherBizDicEditBizDic',
};

const SOURCE_COL = {
  ...AUDIT_CARD_COLS.find(item => item.id === 'source'),
  label: '来源',
  listable: true,
  renderjxs: (scope, h) => {
    const projectId = scope.row.source;
    const options = scope._self.CFG.projects;
    const title = options.find(item => item.id === projectId)?.title;
    return h('div', {}, title);
  }
}

const COMPONENT_COLS = [
  {
    label: '上级',
    id: 'parentId',
    width: '150',
    type: 'treeSelect',
    required: false,
    searchable: false,
    listable: false,
    editable: true,
    validatorKey: 'if',
    validator: (context) => {
      return context.formData.$isTree;
    },
    disabled: (context) => {
      return context.formData.$addChild;
    },
    defaultValue: (context, item, model, parentId) => {
      if (parentId) {
        return parentId;
      }
      if (model) {
        return model.parentId || model.parentid || model.parentCode;
      }
    },
    field: {
      labelKey: 'name',
      valueKey: 'id',
      options: 'PARENT_ID_OPTIONS',
      optionsRenderer: (context, item, model) => {
        const list = context.list.map((v) => {
          return {
            ...v,
            id: v.id || v.code,
            parentId: v.parentId || v.parentid|| v.parentCode,
            isDisabled: model?.id === (v.id || v.code)
          };
        });
        return context.utils.array2tree(list, 'id', 'parentId');
      },
    },
  },
  {
    label: '名称',
    id: 'name',
    type: 'text',
    width: '180',
    align: 'left',
    required: true,
    searchable: true,
    listable: true,
    editable: true,
    maxlength: 50,
  },
  {
    label: '编码',
    id: 'code',
    width: '150',
    type: 'text',
    required: true,
    searchable: true,
    listable: true,
    editable: true,
    maxlength: 50
  },
  SOURCE_COL,
  {
    label: '启用时间',
    id: 'effectTime',
    width: '180',
    type: 'date',
    required: true,
    listable: true,
    editable: true,
    format: 'yyyy-MM-dd hh:mm:ss',
    defaultValue: () => new Date().getTime()
  },
  {
    label: '描述',
    id: 'description',
    type: 'textarea',
    width: '150',
    listable: true,
    editable: true,
    maxlength: 800
  },
  {
    label: '创建时间',
    id: 'createTime',
    width: '180',
    type: 'date',
    listable: true,
    format: 'yyyy-MM-dd hh:mm:ss'
  },
  {
    label: '更新时间',
    id: 'updateTime',
    width: '180',
    type: 'date',
    listable: true,
    format: 'yyyy-MM-dd hh:mm:ss'
  }
];

const COMPONENT_CONFIG = {
  cols: COMPONENT_COLS,
  listAll: true,
};

export { COMPONENT_CONFIG, SEAL_DICT_API_CONFIG, MPMAPI_DICT_API_CONFIG, RXV_DICT_API_CONFIG };
