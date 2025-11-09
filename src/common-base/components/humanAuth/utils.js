import { IDENTIFICATION_TYPE_CODE_ENUM } from '@/common-base/components/humanAuth/constants';

/**
 *
 * @returns 自然人实名认证证件类型
 */
function getHumanCertificationIdentificationTypeDictionary() {
  /**
   * 小程序环境, 仅支持 0 身份证
   *
   * 非小程序环境, 支持
   *  0 身份证
   *  1 护照
   *  B 港澳居民往来内地通行证
   *  C 台湾居民往来大陆通行证
   */
  return window.vm.getCommonDictionary('identificationType').filter((v) =>
    (window.vm.CFG.client.isInMiniprogram ? [IDENTIFICATION_TYPE_CODE_ENUM.IDENTITY_CARD] : [IDENTIFICATION_TYPE_CODE_ENUM.IDENTITY_CARD, IDENTIFICATION_TYPE_CODE_ENUM.PASSPORT, IDENTIFICATION_TYPE_CODE_ENUM.HKMTP, IDENTIFICATION_TYPE_CODE_ENUM.TPTP]).includes(v.code)
  );
}

/**
 * 获取证件类型对应的 c
 *
 * @param {*} code
 *
 * @returns
 */
function getIdentificationTypeCodeByCode(code) {
  return window.vm.getCommonDictionary('identificationType').find((v) => v.code === code)?.c || '';
}

export { getHumanCertificationIdentificationTypeDictionary, getIdentificationTypeCodeByCode };
