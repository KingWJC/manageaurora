const apiCFG = {
  // 向用户静默的模块
  silenceModule: [
    'operlogNoGetway'
  ],
  // 向用户静默的模块
  silenceUrl: [
    '/log/sendH5ErrorLog',
    '/log/sendH5ConsumptionLog'
  ],
  /**
   * 判断是否静默不提示用户
   * @param {*} service 
   * @returns 
   */
  checkSilence: function(service) {
    // console.log(this, service);
    if(service.module && this.silenceModule.some(v => v === service.module)) {
      // console.error('根据模块判断静默不提示用户');
      return true;
    }
    if(service.url && this.silenceUrl.some(v => v === service.url)) {
      // console.error('根据URL判断静默不提示用户');
      return true;
    }
  }
}

export default apiCFG