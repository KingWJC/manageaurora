/*
 * @Author: zhuke zhuke@lonch.com.cn
 * @Date: 2025-03-01 23:17:41
 * @LastEditors: zhuke zhuke@lonch.com.cn
 * @LastEditTime: 2025-03-07 00:23:11
 * @FilePath: \lonch-rxv-fe\src\data\selectTableConfigs.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 *
 */

import { renderOptionLabel } from '@/common-base/components/commonForm/utils/renderUtils';

/**
 * 访视对象选择表格配置
 */
const SAMPLING_PATIENT_SELECT_TABLE_CONFIG = {
  title: '选择访视对象',
  apiModule: 'mpmapi',
  apiKey: 'samplingPatientList',
  rowKey: 'id',
  cols: [
    {
      label: '姓名',
      id: 'humanName',
      width: '150',
      type: 'text',
      listable: true,
      searchable: true,
    },
    {
      label: '手机号',
      id: 'humanCellphone',
      width: '150',
      type: 'text',
      listable: true,
      searchable: true,
    },
    {
      label: '项目',
      id: 'projectName',
      width: '200',
      type: 'text',
      listable: true,
      searchable: true,
    },
    {
      label: '访视机构',
      id: 'orgName',
      width: '150',
      type: 'text',
      listable: true,
      searchable: true,
    },
  ]
};

/**
 * 自然人选择表格配置
 */
const HUMAN_SELECT_TABLE_CONFIG = {
  title: '选择自然人',
  apiModule: 'ca',
  apiKey: 'humanSelectHumans',
  rowKey: 'id',
  cols: [
    {
      label: '姓名',
      id: 'name',
      width: '150',
      type: 'text',
      maxlength: 100,
      searchable: true
    },
    {
      label: '手机号',
      id: 'cellphone',
      width: '150',
      type: 'text',
      maxlength: 100,
      searchable: true
    },
    {
      label: '性别',
      id: 'genderCode',
      width: '150',
      type: 'text',
      render: (row) => {
        if (row.genderCode === '1') {
          return '男';
        } else if (row.genderCode === '2') {
          return '女';
        }
      }
    },
    {
      label: '证件类型',
      id: 'identificationTypeCode',
      width: '150',
      type: 'text',
      render: (row) => {
        return renderOptionLabel({
          row,
          options: window.vm.getCommonDictionary('identificationType'),
          field: 'identificationTypeCode'
        });
      }
    },
    {
      label: '证件号码',
      id: 'identificationNumber',
      width: '150',
      type: 'text'
    }
  ]
};

/**
 * 组织选择表格配置
 */
const ORG_SELECT_TABLE_CONFIG = {
  title: '选择组织',
  apiModule: 'ca',
  apiKey: 'organizeSearchOrgsByPage',
  rowKey: 'id',
  cols: [
    {
      label: '名称',
      id: 'name',
      width: '150',
      type: 'text',
      maxlength: 100,
      searchable: true
    },
    {
      label: '省',
      id: 'provice',
      width: '150',
      type: 'text',
    },
    {
      label: '市',
      id: 'city',
      width: '150',
      type: 'text',
    },
    {
      label: '县',
      id: 'district',
      width: '150',
      type: 'text',
    },
    {
      label: '县',
      id: 'district',
      width: '150',
      type: 'text',
    },
    {
      label: '联系人',
      id: 'linkmanName',
      width: '150',
      type: 'text',
      searchable: true
    },
    {
      label: '联系人电话',
      id: 'linkmanPhone',
      width: '150',
      type: 'text',
      searchable: true
    },
    {
      label: '地址',
      id: 'address',
      width: '150',
      type: 'text',
    },
  ]
};

export {
  SAMPLING_PATIENT_SELECT_TABLE_CONFIG,
  HUMAN_SELECT_TABLE_CONFIG,
  ORG_SELECT_TABLE_CONFIG,
}
