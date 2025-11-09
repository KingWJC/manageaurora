 /**
   * 证件类型正则
   *
   * 0 身份证
   * 1 护照
   * B 港澳居民往来内地通行证
   * C 台湾居民往来大陆通行证
   */
const IDENTIFICATION_TYPE_REGEXP_ENUM = {
  IDENTITY_CARD: /^[1-9]\d{5}[1-9]\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[01])\d{3}(\d|X|x)$/,
  PASSPORT: /^1[45]\d{7}$|([PpSs]\d{7}$)|([SsGgEe]\d{8}$)|([GgTtSsLlQqDdAaFf]\d{8}$)|([HhMm]\d{8,10})$/,
  HKMTP: /(^[HMhm]{1}([0-9]{10})$)|(^[HMhm]{1}([0-9]{8}[0-9A-Za-z]{1})$)/,
  TPTP: /(^[0-9]{8}$)|(^[0-9]{10}$)|(^[A-Za-z][0-9]{9}$)/,
};

 /**
   * 证件类型 code
   *
   * 0 身份证
   * 1 护照
   * B 港澳居民往来内地通行证
   * C 台湾居民往来大陆通行证
   */
const IDENTIFICATION_TYPE_CODE_ENUM = {
  IDENTITY_CARD: '0',
  PASSPORT: '1',
  HKMTP: 'B',
  TPTP: 'C',
};

export { IDENTIFICATION_TYPE_REGEXP_ENUM, IDENTIFICATION_TYPE_CODE_ENUM };
