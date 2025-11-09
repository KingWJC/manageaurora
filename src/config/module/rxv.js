const rxv = {
  /**
   * 获取ICD疾病列表
   */
  dictGetLonchICD: { module: 'rxv', url: '/dict/getLonchICD', method: 'POST', comment: '获取朗致ICD疾病列表' },
  /**
   * 获取ICD疾病列表
   */
  dictGetLonchICD9: { module: 'rxv', url: '/dict/getLonchICD9', method: 'POST', comment: '获取朗致ICD手术与操作列表' },
  /**
   * 获取医保ICD疾病列表
   */
  dictGetNhsaICD10: { module: 'rxv', url: '/dict/getNhsaICD10', method: 'POST', comment: '获取国家医保ICD疾病列表' },
  /**
   * 获取医保ICD手术与操作列表
   */
  dictGetNhsaICD9: { module: 'rxv', url: '/dict/getNhsaICD9', method: 'POST', comment: '获取国家医保ICD手术与操作列表' },
};

export default rxv;
